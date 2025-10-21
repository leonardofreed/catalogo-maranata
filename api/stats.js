export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Dados estáticos baseados nos produtos de exemplo
        const produtos = [
            { preco: 1299.99, categoria: 'Eletrônicos', estoque: 10 },
            { preco: 2499.99, categoria: 'Eletrônicos', estoque: 5 },
            { preco: 29.99, categoria: 'Roupas', estoque: 50 },
            { preco: 199.99, categoria: 'Calçados', estoque: 25 },
            { preco: 89.99, categoria: 'Livros', estoque: 15 },
            { preco: 299.99, categoria: 'Eletrônicos', estoque: 20 }
        ];

        const total_produtos = produtos.length;
        const categorias = [...new Set(produtos.map(p => p.categoria))];
        const total_categorias = categorias.length;
        const preco_medio = produtos.reduce((sum, p) => sum + p.preco, 0) / produtos.length;
        const total_estoque = produtos.reduce((sum, p) => sum + p.estoque, 0);

        res.json({
            total_produtos,
            total_categorias,
            preco_medio: Math.round(preco_medio * 100) / 100,
            total_estoque
        });

    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
