class ArquivosOSDTO:

    def __init__(self, file):
        self.file = file

    def validar(self):

        if not self.file:
            raise ValueError("Arquivo não enviado")

        if not self.file.filename:
            raise ValueError("Arquivo sem nome!")
        
        if not self.file.filename.endswith(".pdf"):
            raise ValueError("Apenas PDFs são permitidos")

        return self
        