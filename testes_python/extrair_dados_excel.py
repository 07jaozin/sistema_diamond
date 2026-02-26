import pandas as pd 
import os
import time
import re
import pdfplumber

def extrair_nome_colunas(arquivo, sheet):

    df = pd.read_excel(arquivo, sheet_name= sheet)
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    colunas = ", ".join([col for col in df.columns if not str(col).startswith("unnamed") and df[col].notna().any()])

    return colunas
        

def extrair_dados(arquivo):

    # Le o excel
    df = pd.read_excel(arquivo)

    # Padronizar nome das colunas
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    dados = []

    # Padrão não recomendado pois em planilhas grandes o iterrows pode degradar
    #Existe funções nativa do pandas que ja fazem isso tudo
    for _, row in df.iterrows():
        print(row[0])
        cliente = {}
        for index, column in enumerate(df.columns):
            cliente[column] = row[index]

        print(cliente)
        dados.append(cliente)
        time.sleep(1)
    
    print(dados)
    

def extrair_dados_melhor(arquivo):

    df = pd.read_excel(arquivo, dtype=str)

    df = df.dropna(axis=1, how="all")

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    df = df.fillna("") # Evita None ou NaN

    dados = df.to_dict(orient="records") # Transforma cada linha em um dicionario, como fiz na função acima, porem mais pratico e limpo

    return dados

def extrair_dados_pdf(arquivo):

    dados = {}

    with pdfplumber.open(arquivo) as pdf:
        texto = ""
        for pagina in pdf.pages:
            texto += pagina.extract_text() + "\n"

    # Regex para capturar campos
    padroes = {
        "nome": r"Nome\s*:\s*(.+)",
        "cpf": r"CPF\s*/\s*CNPJ nº:\s*(.+)",
        "rg": r"RG\s*/\s*IE nº:\s*(.+)",
        "endereco": r"Endereço:\s*(.+)",
        "bairro": r"Bairro:\s*(.+)",
        "cidade_estado": r"Cidade/Estado:\s*(.+)",
        "cep": r"CEP:\s*(.+)",
        "celular": r"Celular:\s*(.+)",
        "email": r"Email:\s*(.+)"
    }
    
    for chave, padrao in padroes.items():
        
        resultado = re.search(padrao, texto)

        if resultado:
            dados[chave] = resultado.group(1).strip()

        else:
            dados[chave] = ""

    return dados


if os.path.exists("controle_cliente.xlsx"):
    dados = extrair_dados_melhor("controle_clientes.xlsx")
    with open("arquivo_teste.txt", "w", encoding="utf-8") as arquivo:
        os.startfile("arquivo_teste.txt")
        for i, item in enumerate(dados, start=1):
            arquivo.write(f"Resgistro {i}\n")
            arquivo.write("-" * 30 + "\n")

            for chave, valor in item.items():
                if valor == '':
                    valor = "Não Definido"
                arquivo.write(f"{chave}: {valor}\n")

            arquivo.write("\n")
            
            

    print(dados)


if os.path.exists("FICHA_CADASTRO_ANDERSONs.pdf"):
    texto = extrair_dados_pdf("FICHA_CADASTRO_ANDERSON.pdf")
    print(texto)

if os.path.exists("controle_clientes_2.xlsx"):
    print("folha de clientes:\n")
    clientes = extrair_nome_colunas("controle_clientes_2.xlsx", 0)
    print(clientes)
    print("\n Folha de obras:\n")
    obras = extrair_nome_colunas("controle_clientes_2.xlsx", 4)
    print(obras)
    
