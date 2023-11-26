import boto3
import json
import os
from dotenv import load_dotenv

# Where audio files will be saved
folder_path = 'bus-stop-display/src/data/audio/'

# Load environment variables from .env.local file
load_dotenv('bus-stop-display/.env.local')

# Access the values of your access keys
access_key_id = os.environ.get('AWS_ACCESS_KEY_ID')
secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')

# Use the access keys in your code
session = boto3.Session(
    aws_access_key_id=access_key_id,
    aws_secret_access_key=secret_access_key,
    region_name='eu-west-2'
)
polly = session.client('polly')


def synthesize_text(bus_stop_name, voice_id, bus_stop_id):
    response = polly.synthesize_speech(
        Text="Next stop: "+bus_stop_name,
        VoiceId=voice_id,
        OutputFormat='mp3'
    )
    with open(bus_stop_id, 'wb') as file:
        file.write(response['AudioStream'].read())


def synthesize_and_save_tts(bus_stop_id, bus_stop_name):
    os.makedirs(folder_path, exist_ok=True)
    output_file = f"{folder_path}{bus_stop_id}.mp3"
    synthesize_text(bus_stop_name, 'Amy', output_file)


# Open the JSON file
with open('bus-stop-display/src/data/custom/205.json', 'r') as file:
    # Load the JSON data
    data = json.load(file)

    # Iterate over the entries in the 'custom' list
    for entry in data['custom']:
        bus_stop_id = entry['atcoCode']
        bus_stop_name = entry['name']

        # Call the function to synthesize text and save audio
        synthesize_and_save_tts(bus_stop_id, bus_stop_name)
