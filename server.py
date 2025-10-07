# #!/usr/bin/env python3
# """
# WriteFlow - AI English Writing Correction Platform
# Simple HTTP server to serve the web application
# """

# import http.server
# import socketserver
# import webbrowser
# import os
# import sys
# from urllib.parse import urlparse, parse_qs
# import json

# class WriteFlowHandler(http.server.SimpleHTTPRequestHandler):

 
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, directory=os.getcwd(), **kwargs)
    
#     def end_headers(self):
#         # Add CORS headers
#         self.send_header('Access-Control-Allow-Origin', '*')
#         self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
#         self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
#         super().end_headers()
    
#     def do_OPTIONS(self):
#         self.send_response(200)
#         self.end_headers()


#     def do_POST(self):
#         if self.path == '/api/correct':
#             self.handle_correction()
#         else:
#             self.send_error(404)
    
#     def handle_correction(self):
#         try:
#             # Read request body
#             content_length = int(self.headers['Content-Length'])
#             post_data = self.rfile.read(content_length)
#             data = json.loads(post_data.decode('utf-8'))
            
#             # Extract content and language
#             content = data.get('content', '')
#             native_language = data.get('nativeLanguage', 'ko')
            
#             if not content.strip():
#                 self.send_json_response({
#                     'error': '작문 내용을 입력해주세요.' if native_language == 'ko' else '请输入写作内容。'
#                 }, 400)
#                 return
            
#             # For demo purposes, return a mock response
#             # In a real implementation, you would call OpenAI API here
#             mock_response = self.generate_mock_response(content, native_language)
#             self.send_json_response(mock_response)
            
#         except Exception as e:
#             print(f"Error handling correction: {e}")
#             self.send_json_response({
#                 'error': 'AI 교정 중 오류가 발생했습니다.' if native_language == 'ko' else 'AI批改过程中出现错误'
#             }, 500)
    
#     def generate_mock_response(self, content, native_language):
#         """Generate a mock response for demonstration"""
#         # Simple mock corrections
#         corrected_content = content.replace('teh', 'the').replace('adn', 'and')
        
#         # Mock scores (randomized for demo)
#         import random
#         overall_score = random.randint(70, 95)
#         grammar_score = random.randint(65, 90)
#         vocabulary_score = random.randint(70, 95)
#         coherence_score = random.randint(75, 90)
        
#         # Mock corrections
#         corrections = []
#         if 'teh' in content:
#             corrections.append({
#                 'original': 'teh',
#                 'corrected': 'the',
#                 'explanation': '맞춤법 오류입니다.' if native_language == 'ko' else '拼写错误。'
#             })
#         if 'adn' in content:
#             corrections.append({
#                 'original': 'adn',
#                 'corrected': 'and',
#                 'explanation': '맞춤법 오류입니다.' if native_language == 'ko' else '拼写错误。'
#             })
        
#         # Mock suggestions
#         suggestions = [
#             '더 구체적인 예시를 추가해보세요.' if native_language == 'ko' else '添加更具体的例子。',
#             '문장을 더 명확하게 연결해보세요.' if native_language == 'ko' else '更清晰地连接句子。'
#         ]
        
#         # Mock explanation
#         explanation = (
#             f"전반적으로 좋은 작문입니다. 전체 점수 {overall_score}점을 받았습니다. "
#             f"문법은 {grammar_score}점, 어휘는 {vocabulary_score}점, 일관성은 {coherence_score}점입니다. "
#             f"몇 가지 작은 오류를 수정하면 더욱 완벽한 작문이 될 것입니다."
#         ) if native_language == 'ko' else (
#             f"总的来说是一篇不错的写作。总分{overall_score}分。"
#             f"语法{vocabulary_score}分，词汇{vocabulary_score}分，连贯性{coherence_score}分。"
#             f"修正一些小错误会让写作更加完美。"
#         )
        
#         return {
#             'corrected_content': corrected_content,
#             'feedback': {
#                 'overall_score': overall_score,
#                 'grammar_score': grammar_score,
#                 'vocabulary_score': vocabulary_score,
#                 'coherence_score': coherence_score,
#                 'corrections': corrections,
#                 'suggestions': suggestions,
#                 'explanation': explanation
#             }
#         }
    
#     def send_json_response(self, data, status_code=200):
#         self.send_response(status_code)
#         self.send_header('Content-type', 'application/json')
#         self.end_headers()
#         response = json.dumps(data, ensure_ascii=False)
#         self.wfile.write(response.encode('utf-8'))

# def main():
    
#     PORT = int(os.environ.get("PORT", 8000))

    
#     # Check if port is available
#     try:
#         with socketserver.TCPServer(("", PORT), WriteFlowHandler) as httpd:
#             print("🚀 WriteFlow Server Starting...")
#             print(f"📝 AI English Writing Correction Platform")
#             print(f"🌐 Server running at: http://localhost:{PORT}")
#             print(f"📖 Open your browser and go to: http://localhost:{PORT}")
#             print("=" * 50)
#             print("Features:")
#             print("✅ English writing correction")
#             print("✅ Korean/Chinese feedback")
#             print("✅ Real-time AI analysis")
#             print("✅ Simple and intuitive UI")
#             print("=" * 50)
#             print("Press Ctrl+C to stop the server")
#             print()
            
#             # Try to open browser automatically
#             try:
#                 webbrowser.open(f'http://localhost:{PORT}')
#                 print("🌐 Browser opened automatically!")
#             except:
#                 print("⚠️  Could not open browser automatically. Please open manually.")
            
#             print()
#             httpd.serve_forever()
            
#     except OSError as e:
#         if e.errno == 48:  # Address already in use
#             print(f"❌ Port {PORT} is already in use. Trying port {PORT + 1}...")
#             PORT += 1
#             with socketserver.TCPServer(("", PORT), WriteFlowHandler) as httpd:
#                 print(f"🌐 Server running at: http://localhost:{PORT}")
#                 webbrowser.open(f'http://localhost:{PORT}')
#                 httpd.serve_forever()
#         else:
#             print(f"❌ Error starting server: {e}")
#             sys.exit(1)
#     except KeyboardInterrupt:
#         print("\n👋 Server stopped. Thank you for using WriteFlow!")

# if __name__ == "__main__":
#     main()

#!/usr/bin/env python3
"""
WriteFlow - AI English Writing Correction Platform
Render-compatible HTTP server
"""

import http.server
import socketserver
import os
import sys
import json
import random

class WriteFlowHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

    def end_headers(self):
        # Add CORS headers
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # Add health check endpoint
        if self.path == "/health":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"OK")
            return
        # Serve static files (index.html, css, js, etc.)
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/correct":
            self.handle_correction()
        else:
            self.send_error(404)

    def handle_correction(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(length)
            data = json.loads(post_data.decode("utf-8"))

            content = data.get("content", "")
            native_language = data.get("nativeLanguage", "ko")

            if not content.strip():
                msg = "작문 내용을 입력해주세요." if native_language == "ko" else "请输入写作内容。"
                self.send_json_response({"error": msg}, 400)
                return

            response = self.generate_mock_response(content, native_language)
            self.send_json_response(response)

        except Exception as e:
            print(f"[Error] handle_correction: {e}")
            msg = "AI 교정 중 오류가 발생했습니다." if native_language == "ko" else "AI批改过程中出现错误。"
            self.send_json_response({"error": msg}, 500)

    def generate_mock_response(self, content, native_language):
        corrected = content.replace("teh", "the").replace("adn", "and")
        overall = random.randint(70, 95)
        grammar = random.randint(65, 90)
        vocab = random.randint(70, 95)
        coherence = random.randint(75, 90)

        corrections = []
        if "teh" in content:
            corrections.append({
                "original": "teh",
                "corrected": "the",
                "explanation": "拼写错误。" if native_language == "zh" else "맞춤법 오류입니다."
            })
        if "adn" in content:
            corrections.append({
                "original": "adn",
                "corrected": "and",
                "explanation": "拼写错误。" if native_language == "zh" else "맞춤법 오류입니다."
            })

        suggestions = [
            "添加更具体的例子。" if native_language == "zh" else "더 구체적인 예시를 추가해보세요.",
            "更清晰地连接句子。" if native_language == "zh" else "문장을 더 명확하게 연결해보세요."
        ]

        explanation = (
            f"总的来说是一篇不错的写作。总分{overall}分。语法{grammar}分，词汇{vocab}分，连贯性{coherence}分。"
            f"修正一些小错误会让写作更加完美。"
        ) if native_language == "zh" else (
            f"전반적으로 좋은 작문입니다. 전체 점수 {overall}점, 문법 {grammar}점, 어휘 {vocab}점, 일관성 {coherence}점입니다."
            f"몇 가지 작은 오류를 수정하면 더욱 완벽한 작문이 될 것입니다."
        )

        return {
            "corrected_content": corrected,
            "feedback": {
                "overall_score": overall,
                "grammar_score": grammar,
                "vocabulary_score": vocab,
                "coherence_score": coherence,
                "corrections": corrections,
                "suggestions": suggestions,
                "explanation": explanation
            }
        }

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

def main():
    PORT = int(os.environ.get("PORT", 8000))

    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), WriteFlowHandler) as httpd:
            print("============================================================")
            print("WriteFlow AI English Correction Server")
            print(f"Running on: http://0.0.0.0:{PORT}")
            print("Health check: /health")
            print("API endpoint: POST /api/correct")
            print("============================================================")
            httpd.serve_forever()

    except OSError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 Server stopped.")

if __name__ == "__main__":
    main()

