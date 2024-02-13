import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

class Mailer:
    @staticmethod
    def send_email(subject, html_content, email_to):
        message = Mail(
            from_email=os.environ.get('SENDGRID_SENDER'),
            to_emails=email_to,
            subject=subject,
            html_content=html_content
        )
        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            print(e)

def on_contact_form_submit(email, name):
    message = f"""
    <p>Hi {name},</p>
    <p>Thank you for contacting us. We will get back to you as soon as possible.</p>
    <p>Best regards,</p>
    <p>GeckoJump Team</p>
    """
    message = Mailer.send_email('Thank you for contacting us', message, email)
        
        