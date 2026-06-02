// API клиент для взаимодействия с бэкендом

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Games
  async getGames(gameType?: string) {
    const params = gameType ? `?game_type=${gameType}` : '';
    return this.request(`/api/games${params}`);
  }

  async getGame(id: number) {
    return this.request(`/api/games/${id}`);
  }

  // Activities
  async getActivities(isPublic?: boolean) {
    const params = isPublic !== undefined ? `?is_public=${isPublic}` : '';
    return this.request(`/api/activities${params}`);
  }

  async getActivity(id: number) {
    return this.request(`/api/activities/${id}`);
  }

  async createActivity(data: any) {
    return this.request('/api/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Assignments
  async getUserAssignments(userId: number) {
    return this.request(`/api/activities/assignments/user/${userId}`);
  }

  async createAssignment(data: any) {
    return this.request('/api/activities/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Users
  async getUsers() {
    return this.request('/api/users');
  }

  async getUser(id: number) {
    return this.request(`/api/users/${id}`);
  }
}

export const apiClient = new ApiClient();
