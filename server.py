
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
        if self.path in ["/daily-sentence.html", "/email-mentor.html", "/essay-polish.html"]:
            return super().do_GET()
        # Serve static files (index.html, css, js, etc.)
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/correct":
            self.handle_correction()
        else:
            self.send_error(404)

    def handle_correction(self):
        native_language = "ko"  # Default to Korean
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
        explanation_teh = "맞춤법 오류: 'the'가 맞습니다" if native_language == "ko" else "拼写错误：应为 the"
        explanation_adn = "맞춤법 오류: 'and'가 맞습니다" if native_language == "ko" else "拼写错误：应为 and"

        diff_html = content.replace(
            "teh", f"<del data-explanation='{explanation_teh}'>teh</del><ins>the</ins>"
        )
        diff_html = diff_html.replace("adn", f"<del data-explanation='{explanation_adn}'>adn</del><ins>and</ins>")

        # 2. 生成“全文润色”后的内容
        if native_language == "ko":
            polished_content = "제 관점에서 볼 때, 기술은 여러 측면에서 우리의 존재를 심오하게 재구성했습니다. 주로, 기술은 더 쉽고 빠른 의사소통을 촉진하여, 우리가 인터넷을 통해 전 세계 사람들과 즉시 연결될 수 있게 합니다."
        else: # "zh"
            polished_content = "在我看来，技术在很多方面深刻地重塑了我们的生活。首先，它促进了更简单、更快速的沟通，使我们能够通过互联网与全球各地的人即时联系。"

        overall = 85
        grammar = 90
        vocab = 80
        coherence = 85

        # 3. 根据语言生成不同的反馈信息
        corrections = []
        if "teh" in content:
            corrections.append({
                "original": "teh",
                "corrected": "the",
                "explanation": "맞춤법 오류입니다. 'the'가 올바른 철자입니다." if native_language == "ko" else "拼写错误。'the' 是正确的拼写。"
            })
        if "adn" in content:
            corrections.append({
                "original": "adn",
                "corrected": "and",
                "explanation": "맞춤법 오류입니다. 'and'가 올바른 철자입니다." if native_language == "ko" else "拼写错误。'and' 是正确的拼写。"
            })

        suggestions = [
            "더 구체적인 예시를 추가해보세요." if native_language == "ko" else "添加更具体的例子。",
            "문장을 더 명확하게 연결해보세요." if native_language == "ko" else "更清晰地连接句子。"
        ]

        if native_language == "ko":
            explanation = (f"전반적으로 좋은 작문입니다. 전체 점수 {overall}점, 문법 {grammar}점, 어휘 {vocab}점, 일관성 {coherence}점입니다. "
                         f"몇 가지 작은 오류를 수정하면 더욱 완벽한 작문이 될 것입니다. "
                         f"예를 들어, 'from my point of view' 대신 'From my perspective'를 사용하면 더 학술적인 느낌을 줄 수 있습니다.")
        else:
            explanation = (f"总的来说是一篇不错的写作。总分 {overall}分，语法 {grammar}分，词汇 {vocab}分，连贯性 {coherence}分。 "
                         f"修正一些小错误会让写作更加完美。 "
                         f"例如，使用 'From my perspective' 替代 'from my point of view' 会让语气更显学术性。")

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
