export class ApiService {
  private BASE_URL = 'http://localhost:8080/api';
  private accessToken = '';
  private refreshToken = '';

  constructor(accessToken: string | null, refreshToken: string | null) {
    if (!accessToken || !refreshToken) {
      throw new Error('Access/refresh token are required for the ApiSerice');
    }
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private getHeaders() {
    const headers = new Headers();
    headers.append('x-stack-access-token', this.accessToken);
    headers.append('x-stack-refresh-token', this.refreshToken);
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  async get(endpoint: string) {
    const res = await fetch(`${this.BASE_URL}${endpoint}`, {
      headers: this.getHeaders()
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`HTTP Error: ${res.status}`);
  }

  async post(endpoint: string, data: unknown) {
    const res = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    if (res.ok) {
      return await res.json();
    }
    throw new Error(`HTTP Error: ${res.status}`);
  }

  async put(endpoint: string, data: unknown) {
    const res = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`HTTP Error: ${res.status}`);
  }
  async delete(endpoint: string, data: unknown) {
    const res = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`HTTP Error: ${res.status}`);
  }
}
