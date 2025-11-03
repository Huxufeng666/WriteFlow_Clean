
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
import webbrowser

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
        
        # 1. 生成用于“全文纠错”的 diff HTML
        diff_html = content.replace("teh", "<del data-explanation='拼写错误：应为 the'>teh</del><ins>the</ins>")
        diff_html = diff_html.replace("adn", "<del data-explanation='拼写错误：应为 and'>adn</del><ins>and</ins>")

        # 2. 生成“全文润色”后的内容
        polished_content = "From my perspective, technology has profoundly reshaped our existence in numerous aspects. Primarily, it facilitates easier and more rapid communication, enabling us to connect with individuals across the globe instantaneously via the internet."

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
            "diff_html": diff_html,
            "polished_content": polished_content,
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
    PORT = int(os.environ.get("PORT", 8001)) # 使用 8001 端口以避免常见冲突
    URL = f"http://localhost:{PORT}"

    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), WriteFlowHandler) as httpd:
            print("============================================================")
            print("WriteFlow AI English Correction Server")
            print(f"Server running! Access it at: {URL}")
            print("Health check: /health")
            print("API endpoint: POST /api/correct")
            print("============================================================")
            
            webbrowser.open(URL) # 在默认浏览器中打开 URL
            httpd.serve_forever()

    except OSError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 Server stopped.")

if __name__ == "__main__":
    main()
