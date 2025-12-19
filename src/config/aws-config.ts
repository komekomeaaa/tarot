// AWS設定
export const awsConfig = {
    region: 'ap-northeast-1',
    userPoolId: 'ap-northeast-1_MOJHUBPa9',
    userPoolWebClientId: '7cjts68qb47nt5k3mkia30lbmd',
    apiUrl: 'https://pvcljyqd70.execute-api.ap-northeast-1.amazonaws.com',
};

// API呼び出しヘルパー
export async function apiCall(
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    body?: object,
    token?: string
): Promise<any> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${awsConfig.apiUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'APIエラー');
    }

    return data;
}

// 認証API
export const authApi = {
    async signUp(username: string, password: string) {
        return apiCall('/auth/signup', 'POST', { username, password });
    },

    async signIn(username: string, password: string) {
        return apiCall('/auth/signin', 'POST', { username, password });
    },

    async checkLimit(token: string) {
        return apiCall('/reading/check-and-record', 'POST', { action: 'check' }, token);
    },

    async recordReading(token: string, sigilType: string) {
        return apiCall('/reading/check-and-record', 'POST', { action: 'record', sigilType }, token);
    },
};

// トークン管理
export const tokenStorage = {
    getToken(): string | null {
        return localStorage.getItem('tarot_token');
    },

    setToken(token: string): void {
        localStorage.setItem('tarot_token', token);
    },

    removeToken(): void {
        localStorage.removeItem('tarot_token');
    },

    isLoggedIn(): boolean {
        return !!this.getToken();
    },
};
