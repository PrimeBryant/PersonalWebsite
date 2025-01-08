class ChatWidget {
    constructor() {
        this.chatWindow = document.querySelector('.chat-window');
        this.messagesContainer = document.querySelector('.chat-messages');
        this.input = document.querySelector('.chat-input');
        this.sendBtn = document.querySelector('.send-message');

        // API 配置
        this.API_URL = 'https://api.chatanywhere.tech/v1/chat/completions';
        this.API_KEY = 'sk-MRC03NtGCqOBWn7PGH9adFRNOVImikl59vlFZ8O3cqBobBZq';
        
        // 系统提示词
        this.systemPrompt = {
            role: 'system',
            content: `你是一个友好的AI助手，负责回答关于阿武的问题。基本信息如下：
            - 姓名：阿武
            - 职业：打工人
            - 工作经历：
              * 2020-至今：资深打工人，追求工作与生活的平衡
              * 2018-2020：初级打工人，开启职场生涯
            - 生活态度：
              * 乐观向上：保持积极心态
              * 积极进取：不断学习成长
              * 热爱生活：享受生活点滴
            
            请以友好且轻松的方式回答问题。如遇到信息之外的问题，请礼貌地表示不确定。`
        };
        
        this.conversationHistory = [this.systemPrompt];
        this.init();
    }

    init() {
        // 发送消息事件监听
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 自动调整输入框高度
        this.input.addEventListener('input', () => {
            this.input.style.height = 'auto';
            this.input.style.height = this.input.scrollHeight + 'px';
        });
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // 添加用户消息
        this.addMessage(message, 'user');
        this.input.value = '';
        this.input.style.height = 'auto';

        // 保存用户消息到对话历史
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // 显示加载状态
        const typingDiv = this.showTypingIndicator();

        try {
            // 调用 AI API
            const response = await this.callAI(message);
            
            // 移除加载状态
            this.messagesContainer.removeChild(typingDiv);
            
            // AI 响应已经在 callAI 方法中处理，这里不需要重复添加
        } catch (error) {
            // 移除加载状态
            this.messagesContainer.removeChild(typingDiv);
            // 显示错误消息
            this.addMessage('抱歉，发生了错误，请稍后重试。', 'error');
            console.error('AI API Error:', error);
        }
    }

    async callAI(message) {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [...this.conversationHistory],
                    max_tokens: 2000,
                    temperature: 0.7,
                    top_p: 0.9,
                    stream: true,
                    presence_penalty: 0.6,
                    frequency_penalty: 0.5
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `API 请求失败: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('没有收到响应数据流');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiResponse = '';
            let messageStarted = false;

            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;
                            
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.choices && parsed.choices[0].delta?.content) {
                                    const content = parsed.choices[0].delta.content;
                                    aiResponse += content;
                                    
                                    if (!messageStarted) {
                                        this.addMessage('', 'ai');
                                        messageStarted = true;
                                    }
                                    
                                    const lastMessage = this.messagesContainer.lastElementChild;
                                    if (lastMessage) {
                                        const contentP = lastMessage.querySelector('p');
                                        if (contentP) {
                                            contentP.textContent = aiResponse;
                                        }
                                    }
                                    this.scrollToBottom();
                                }
                            } catch (e) {
                                console.error('解析响应数据出错:', e);
                            }
                        }
                    }
                }

                // 完成后保存到对话历史
                if (aiResponse) {
                    this.conversationHistory.push({
                        role: 'assistant',
                        content: aiResponse
                    });
                }

                return aiResponse;
            } catch (error) {
                console.error('读取响应流时出错:', error);
                throw error;
            }
        } catch (error) {
            console.error('调用 AI API 时出错:', error);
            throw error;
        }
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <p>AI 正在思考...</p>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        return typingDiv;
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // 添加错误处理方法
    handleError(error) {
        console.error('Chat Error:', error);
        this.addMessage('抱歉，发生了错误。请稍后重试或联系支持。', 'error');
    }
}

// 初始化聊天窗口
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
}); 