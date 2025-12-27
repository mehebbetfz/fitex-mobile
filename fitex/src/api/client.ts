import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Создаем экземпляр axios
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки оффлайн режима
api.interceptors.request.use(
  async (config) => {
    const netInfo = await NetInfo.fetch();
    
    // Если нет интернета, сохраняем запрос для оффлайн обработки
    if (!netInfo.isConnected) {
      await saveOfflineRequest(config);
      throw new axios.Cancel('Нет подключения к интернету');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Нет доступа (нет подписки)
      alert('Для доступа к этой функции требуется подписка');
    }
    
    return Promise.reject(error);
  }
);

const saveOfflineRequest = async (config: any) => {
  try {
    const offlineRequests = await AsyncStorage.getItem('offline_requests');
    const requests = offlineRequests ? JSON.parse(offlineRequests) : [];
    
    requests.push({
      url: config.url,
      method: config.method,
      data: config.data,
      timestamp: new Date().toISOString(),
    });
    
    await AsyncStorage.setItem('offline_requests', JSON.stringify(requests));
  } catch (error) {
    console.error('Error saving offline request:', error);
  }
};

export default api;