from functools import wraps
import json
from flask import request, current_app
import requests
import os
from google.cloud import recaptchaenterprise_v1
from google.cloud.recaptchaenterprise_v1 import Assessment


def create_assessment(
    token: str, recaptcha_action: str
) -> Assessment:
    """Create an assessment to analyze the risk of a UI action.
    Args:
        project_id: Your Google Cloud Project ID.
        recaptcha_key: The reCAPTCHA key associated with the site/app
        token: The generated token obtained from the client.
        recaptcha_action: Action name corresponding to the token.
    """

    client = recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient(
      client_options={"api_key": current_app.config['GOOGLE_CLOUD_API_KEY']}
    )
    project_name = f"projects/{current_app.config['GOOGLE_CLOUD_PROJECT_ID']}"
    site_key = current_app.config['RECAPTCHA_SITE_KEY']

    # Set the properties of the event to be tracked.
    event = recaptchaenterprise_v1.Event()
    event.token = token
    event.site_key = site_key

    assessment = recaptchaenterprise_v1.Assessment()
    assessment.event = event


    # Build the assessment request.
    request = recaptchaenterprise_v1.CreateAssessmentRequest()
    request.assessment = assessment
    request.parent = project_name

    response = client.create_assessment(request)

    # Check if the token is valid.
    if not response.token_properties.valid:
        print(
            "The CreateAssessment call failed because the token was "
            + "invalid for the following reasons: "
            + str(response.token_properties.invalid_reason)
        )
        return

    # Check if the expected action was executed.
    if response.token_properties.action != recaptcha_action:
        print(
            "The action attribute in your reCAPTCHA tag does"
            + "not match the action you are expecting to score"
        )
        return
    else:
        # Get the risk score and the reason(s).
        # For more information on interpreting the assessment, see:
        # https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
        for reason in response.risk_analysis.reasons:
            print(reason)
        print(
            "The reCAPTCHA score for this token is: "
            + str(response.risk_analysis.score)
        )
        # Get the assessment name (id). Use this to annotate the assessment.
        assessment_name = client.parse_assessment_path(response.name).get("assessment")
        print(f"Assessment name: {assessment_name}")
    return response


def recaptcha_protect(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        # Get the reCAPTCHA token from the request.
        token = request.json.get("token")
        recaptcha_action = request.json.get("action")

        if not token:
            return json.dumps({"error": "reCAPTCHA token is missing"}), 400
        
        if not recaptcha_action:
            return json.dumps({"error": "reCAPTCHA action is missing"}), 400

        site_key = "6LdFim8pAAAAAHwTQlWbx6TCK52_HqJqyYJMAQyD"

        # Create an assessment and check the response.
        response = create_assessment(token, recaptcha_action)

        # If the score is below the threshold, return an error.
        if response.risk_analysis.score < 0.5:
            return json.dumps({"error": "reCAPTCHA score is too low"}), 400
        
        return view(*args, **kwargs)
    return wrapper