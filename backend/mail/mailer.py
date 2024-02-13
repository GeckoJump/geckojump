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
            api_key = os.environ.get('SENDGRID_API_KEY')
            print(f"api_key: {api_key}\nfrom:{os.environ.get('SENDGRID_SENDER')}\nemail_to: {email_to}\nsubject: {subject}\nhtml_content: {html_content}")
            sg = SendGridAPIClient(api_key)
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            print(e)

def on_contact_form_submit(email, name, message, company, phone):
    display_name = name.split(' ')[0]
    client_message = f"""
    <p>Hey {display_name},</p>
    <p>Thank you for reaching out to us! We've received your message and appreciate your interest in GeckoJump. Our team will get back to you as soon as possible.</p>
    <p>Best regards,</p>
    <p>GeckoJump Team</p>
    """
    Mailer.send_email('Thank you for Reaching Out', client_message, email)
    admin_message = f"""
    <p>Hey Admin,</p>
    <p>{name} has reached out to us. Here are the details:</p>
    <p>Email: {email}</p>
    <p>Message: {message}</p>
    <p>Company: {company}</p>
    <p>Phone: {phone}</p>
    <p>Best regards,</p>
    <p>GeckoJump Team</p>
    """
    Mailer.send_email('New Contact Form Submission', admin_message, "contact@geckojump.com")



        
        