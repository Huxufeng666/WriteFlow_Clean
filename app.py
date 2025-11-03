from flask import render_template, send_from_directory
# import os
# import json
# import requests
# from flask import Flask, request, jsonify, render_template, send_from_directory

# # 1. 初始化 Flask 应用
# app = Flask(__name__, static_folder='.', static_url_path='')

# # 2. 从环境变量中安全地获取 API 密钥
# #    在部署平台（如 Render）上，你需要设置一个名为 OPENAI_API_KEY 的环境变量
# API_KEY = os.environ.get('OPENAI_API_KEY')

# def call_openai_api(content, native_language):
#     """安全地调用 OpenAI API"""
#     if not API_KEY:
#         raise ValueError("OpenAI API Key not configured. Please set the OPENAI_API_KEY environment variable.")

#     lang_text = 'Korean' if native_language == 'ko' else 'Chinese'
#     system_prompt = f"""You are an expert English writing tutor. Your task is to:
# 1. Correct grammar, spelling, and punctuation errors
# 2. Suggest better vocabulary and expressions
# 3. Improve sentence structure and flow
# 4. Provide detailed feedback in {lang_text}

# Format your response as a single, valid JSON object with the following structure:
# {{
#   "corrected_content": "corrected English text",
#   "feedback": {{
#     "overall_score": 85, "grammar_score": 90, "vocabulary_score": 80, "coherence_score": 85,
#     "corrections": [ {{ "original": "incorrect text", "corrected": "corrected text", "explanation": "explanation in {lang_text}" }} ],
#     "suggestions": [ "suggestion 1 in {lang_text}", "suggestion 2 in {lang_text}" ],
#     "explanation": "overall feedback in {lang_text}"
#   }}
# }}"""

#     headers = {
#         'Content-Type': 'application/json',
#         'Authorization': f'Bearer {API_KEY}'
#     }
#     payload = {
#         'model': 'gpt-4',
#         'messages': [{'role': 'system', 'content': system_prompt}, {'role': 'user', 'content': content}],
#         'temperature': 0.3,
#         'max_tokens': 2000
#     }
#     response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload)
#     response.raise_for_status()  # 如果请求失败，则会引发异常
    
#     response_data = response.json()
#     return json.loads(response_data['choices'][0]['message']['content'])

# # 3. 创建 API 路由
# @app.route('/api/correct', methods=['POST'])
# def handle_correction():
#     try:
#         data = request.get_json()
#         content = data.get('content', '')
#         native_language = data.get('nativeLanguage', 'ko')

#         if not content.strip():
#             error_msg = '작문 내용을 입력해주세요.' if native_language == 'ko' else '请输入写作内容。'
#             return jsonify({'error': error_msg}), 400

#         ai_response = call_openai_api(content, native_language)
#         return jsonify(ai_response)

#     except Exception as e:
#         print(f"Error handling correction: {e}")
#         error_msg = f'AI 교정 중 오류가 발생했습니다: {e}' if native_language == 'ko' else f'AI批改过程中出现错误: {e}'
#         return jsonify({'error': error_msg}), 500



# # https://github.com/hxufeng66-cmd/WriteFlow2.git



import os
import json
import requests
import re # re is not used, but we keep it to avoid breaking changes if it was intended for something.
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

API_KEY = os.environ.get('OPENAI_API_KEY')

# --- Static File Serving ---
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    # This serves files like style.css, common.js, etc.
    # It also serves html pages like email-mentor.html
    if filename.endswith(('.html', '.css', '.js')):
        return send_from_directory(app.static_folder, filename)
    return send_from_directory(app.static_folder, 'index.html') # Fallback to index

def safe_json_parse(content):
    try:
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            return json.loads(match.group(0))
    except Exception as e:
        print(f"⚠️ JSON parse error: {e}")
    return {"error": "Invalid JSON format from model."}

def call_openai_api(content, native_language):
    if not API_KEY:
        raise ValueError("OpenAI API Key not configured. Please set the OPENAI_API_KEY environment variable.")

    lang_text = 'Korean' if native_language == 'ko' else 'Chinese'
    system_prompt = f"""You are an expert English writing tutor...
(略，保持原内容)
"""

    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {API_KEY}'}
    payload = {'model': 'gpt-4', 'messages': [{'role': 'system', 'content': system_prompt}, {'role': 'user', 'content': content}], 'temperature': 0.3, 'max_tokens': 1500}

    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload)
    response.raise_for_status()

    data = response.json()
    return safe_json_parse(data['choices'][0]['message']['content'])

@app.route('/api/correct', methods=['POST'])
def handle_correction():
    native_language = 'ko' # Default language
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON payload'}), 400
            
        content = data.get('content', '')
        native_language = data.get('nativeLanguage', 'ko')

        if not content.strip():
            msg = '작문 내용을 입력해주세요.' if native_language == 'ko' else '请输入写作内容。'
            return jsonify({'error': msg}), 400
        result = call_openai_api(content, native_language)
        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        msg = 'AI 교정 중 오류가 발생했습니다.' if native_language == 'ko' else f'AI批改过程中出现错误: {e}'
        return jsonify({'error': msg}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)