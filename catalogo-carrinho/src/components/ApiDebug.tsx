import React, { useState } from 'react';
import apiService from '../services/api';
import './ApiDebug.css';

const ApiDebug: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const result = await apiService.testApiConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testando com fetch direto...');
      const response = await fetch('https://api.quase24horas.top/api/catalog');
      const data = await response.json();
      console.log('✅ Fetch direto bem-sucedido:', data);
      setTestResult({ success: true, data, method: 'fetch' });
    } catch (error) {
      console.error('❌ Fetch direto falhou:', error);
      setTestResult({ success: false, error, method: 'fetch' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-debug">
      <h3>🔧 Debug da API</h3>
      <p><strong>URL da API:</strong> https://api.quase24horas.top/api/catalog</p>
      
      <div className="debug-buttons">
        <button 
          onClick={testApi} 
          disabled={loading}
          className="debug-btn"
        >
          {loading ? '🔄 Testando...' : '🧪 Testar com Axios'}
        </button>
        
        <button 
          onClick={testDirectFetch} 
          disabled={loading}
          className="debug-btn"
        >
          {loading ? '🔄 Testando...' : '🌐 Testar com Fetch'}
        </button>
      </div>

      {testResult && (
        <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
          <h4>{testResult.success ? '✅ Sucesso!' : '❌ Erro'}</h4>
          <p><strong>Método:</strong> {testResult.method || 'axios'}</p>
          
          {testResult.success ? (
            <div>
              <p><strong>Dados recebidos:</strong></p>
              <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
            </div>
          ) : (
            <div>
              <p><strong>Erro:</strong></p>
              <pre>{JSON.stringify(testResult.error, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiDebug;
