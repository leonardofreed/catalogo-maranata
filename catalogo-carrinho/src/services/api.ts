import axios from 'axios';
import { mockProducts } from '../data/mockProducts';

const API_BASE_URL = 'https://api.quase24horas.top/api/catalog';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  // Armazenamento local para produtos cadastrados
  private localProducts: Product[] = [];

  async getProducts(): Promise<Product[]> {
    try {
      console.log('🔄 Tentando buscar produtos da API:', API_BASE_URL);
      const response = await this.api.get('/');
      console.log('✅ API respondeu com sucesso:', response.data);
      const apiResponse = response.data;
      
      // Verifica se a resposta tem a estrutura esperada
      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        console.log(`📦 Encontrados ${apiResponse.data.length} produtos na API`);
        
        // Mapeia os dados da API para o formato esperado
        const mappedProducts: Product[] = apiResponse.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.nome || '',
          description: item.descricao || '',
          price: parseFloat(item.preco) || 0,
          image: item.imagem || '',
          category: item.categoria || '',
          stock: item.ativo ? 10 : 0 // Assumindo estoque baseado no status ativo
        }));
        
        console.log('🔄 Produtos mapeados:', mappedProducts);
        // Combina produtos da API com produtos locais
        return [...mappedProducts, ...this.localProducts];
      } else {
        console.warn('⚠️ API retornou dados em formato inesperado:', apiResponse);
        return [...mockProducts, ...this.localProducts];
      }
    } catch (error) {
      console.error('❌ Erro ao buscar produtos da API:', error);
      console.log('🔄 Usando dados mock + produtos locais');
      // Retorna dados mock + produtos locais em caso de erro na API
      return [...mockProducts, ...this.localProducts];
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API não disponível, usando dados mock:', error);
      // Busca nos dados mock e produtos locais
      const allProducts = [...mockProducts, ...this.localProducts];
      const product = allProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      return product;
    }
  }




  // Método para testar a API diretamente
  async testApiConnection(): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
      console.log('🧪 Testando conexão com a API...');
      const response = await this.api.get('/');
      console.log('✅ Teste da API bem-sucedido:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Teste da API falhou:', error);
      return { success: false, error };
    }
  }
}

const apiService = new ApiService();
export default apiService;
