export default async function handler(req, res) {
    console.log('API Produtos chamada:', req.method, req.query);
    
    // Dados estáticos de exemplo
    const produtosExemplo = [
        {
            id: 1,
            nome: 'Smartphone Samsung Galaxy',
            descricao: 'Smartphone com tela de 6.1 polegadas, 128GB de armazenamento',
            preco: 1299.99,
            categoria: 'Eletrônicos',
            estoque: 10,
            imagem_url: 'https://via.placeholder.com/300x200?text=Smartphone',
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
        },
        {
            id: 2,
            nome: 'Notebook Dell Inspiron',
            descricao: 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD',
            preco: 2499.99,
            categoria: 'Eletrônicos',
            estoque: 5,
            imagem_url: 'https://via.placeholder.com/300x200?text=Notebook',
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
        },
        {
            id: 3,
            nome: 'Camiseta Básica',
            descricao: 'Camiseta 100% algodão, disponível em várias cores',
            preco: 29.99,
            categoria: 'Roupas',
            estoque: 50,
            imagem_url: 'https://via.placeholder.com/300x200?text=Camiseta',
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
        },
        {
            id: 4,
            nome: 'Tênis Esportivo',
            descricao: 'Tênis para corrida com tecnologia de amortecimento',
            preco: 199.99,
            categoria: 'Calçados',
            estoque: 25,
            imagem_url: 'https://via.placeholder.com/300x200?text=Tênis',
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
        },
        {
            id: 5,
            nome: 'Livro JavaScript',
            descricao: 'Livro completo sobre programação JavaScript',
            preco: 89.99,
            categoria: 'Livros',
            estoque: 15,
            imagem_url: 'https://via.placeholder.com/300x200?text=Livro',
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
        },
        {
            id: 6,
            nome: 'Fone de Ouvido Bluetooth',
            descricao: 'Fone sem fio com cancelamento de ruído',
            preco: 299.99,
            categoria: 'Eletrônicos',
            estoque: 20,
            imagem_url: 'https://via.placeholder.com/300x200?text=Fone',
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
        }
    ];

    try {
        if (req.method === 'GET') {
            const { categoria, busca, ordenar } = req.query;
            let produtos = [...produtosExemplo];

            // Filtro por categoria
            if (categoria && categoria !== 'Todas as categorias') {
                produtos = produtos.filter(produto => 
                    produto.categoria.toLowerCase() === categoria.toLowerCase()
                );
            }

            // Busca por nome ou descrição
            if (busca) {
                const termoBusca = busca.toLowerCase();
                produtos = produtos.filter(produto => 
                    produto.nome.toLowerCase().includes(termoBusca) ||
                    produto.descricao.toLowerCase().includes(termoBusca)
                );
            }

            // Ordenação
            if (ordenar) {
                switch (ordenar) {
                    case 'nome':
                        produtos.sort((a, b) => a.nome.localeCompare(b.nome));
                        break;
                    case 'preco_asc':
                        produtos.sort((a, b) => a.preco - b.preco);
                        break;
                    case 'preco_desc':
                        produtos.sort((a, b) => b.preco - a.preco);
                        break;
                    case 'categoria':
                        produtos.sort((a, b) => a.categoria.localeCompare(b.categoria));
                        break;
                    default:
                        produtos.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
                }
            } else {
                produtos.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
            }

            console.log('Retornando produtos:', produtos.length);
            res.json(produtos);

        } else if (req.method === 'POST') {
            // Para POST, simular criação (não persiste)
            const { nome, descricao, preco, categoria, estoque, imagem_url } = req.body;

            if (!nome || !preco || !categoria) {
                return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
            }

            const novoProduto = {
                id: Date.now(),
                nome,
                descricao: descricao || '',
                preco: parseFloat(preco),
                categoria,
                estoque: parseInt(estoque) || 0,
                imagem_url: imagem_url || 'https://via.placeholder.com/300x200?text=Produto',
                data_criacao: new Date().toISOString(),
                data_atualizacao: new Date().toISOString()
            };

            res.status(201).json({ 
                id: novoProduto.id,
                message: 'Produto criado com sucesso (modo demonstração)'
            });

        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('Erro na API de produtos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

