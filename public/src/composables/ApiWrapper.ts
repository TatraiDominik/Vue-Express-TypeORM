import axios,  { type AxiosResponse } from 'axios'

export class ApiWrapper {

  public static async get<T = any>(route: string, data: any): Promise<AxiosResponse<T>> {

    return await this.request<T>('GET', route, data);
  }

  public static async post<T = any>(route: string, data: any): Promise<AxiosResponse<T>> {
    return await this.request<T>('POST', route, data);
  }

  public static async patch<T = any>(route: string, data: any): Promise<AxiosResponse<T>> {
    return await this.request<T>('PATCH', route, data);
  }

  public static async put<T = any>(route: string, data: any): Promise<AxiosResponse<T>> {
    return await this.request<T>('PUT', route, data);
  }

  public static async delete<T = any>(route: string, data: any): Promise<AxiosResponse<T>> {
    return await this.request<T>('DELETE', route, data);
  }

  private static async request<T = any>(
    method: string,
    route: string,
    data: any,
  ): Promise<AxiosResponse<T>> {
    const res = await axios.request({
      method,
      url: route,
      baseURL: import.meta.env.VITE_API_BASE_URL,
      data
    });
    return res;
  }
}
