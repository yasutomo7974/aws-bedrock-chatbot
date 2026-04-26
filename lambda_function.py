import json
import boto3

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    user_message = body.get('message', 'こんにちは')
    
    client = boto3.client('bedrock-runtime', region_name='us-east-1')
    
    response = client.converse(
        modelId='arn:aws:bedrock:us-east-1:088332244230:inference-profile/global.anthropic.claude-sonnet-4-6',
        messages=[
            {
                'role': 'user',
                'content': [{'text': user_message}]
            }
        ]
    )
    
    reply = response['output']['message']['content'][0]['text']
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'reply': reply}, ensure_ascii=False)
    }