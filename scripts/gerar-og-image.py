"""Gera public/og-image.jpg (1200x630), a imagem que aparece quando o link é compartilhado.
Uso: python3 scripts/gerar-og-image.py  (requer Pillow)"""
import math, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630
AMARELO = (253, 202, 10)
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def ondas(largura, alpha, n=12):
    camada = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    for i in range(n):
        k = i / (n - 1)
        base = H * (0.45 + 0.5 * k)
        amp = H * (0.05 + 0.08 * math.sin(k * math.pi))
        forca = 0.25 + 0.75 * math.sin(k * math.pi)
        pts = []
        for x in range(-10, W + 20, 6):
            p = x / W
            y = base + math.sin(p * 3.2 + 1.1 + k * 2.2) * amp + math.sin(p * 5.5 - 0.7 + k * 3.1) * amp * 0.4 + math.sin(p * 1.4 + 0.5 + k) * amp * 0.6
            pts.append((x, y))
        d.line(pts, fill=AMARELO + (int(min(1, alpha * forca) * 255),), width=largura, joint="curve")
    return camada


base = Image.new("RGBA", (W, H), (0, 0, 0, 255))
for largura, alpha, blur in [(34, 0.10, 22), (18, 0.16, 12), (8, 0.26, 5), (3, 0.46, 1.4)]:
    base = Image.alpha_composite(base, ondas(largura, alpha).filter(ImageFilter.GaussianBlur(blur)))
base = Image.alpha_composite(base, ondas(1, 0.8))

# escurece a parte de cima para o texto ficar legível
vinheta = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dv = ImageDraw.Draw(vinheta)
for y in range(H):
    dv.line([(0, y), (W, y)], fill=(0, 0, 0, int(max(0, 235 * (1 - y / (H * 0.74))))))
base = Image.alpha_composite(base, vinheta)

d = ImageDraw.Draw(base)
logo = Image.open(os.path.join(RAIZ, "public/logo-ecsilab.png")).convert("RGBA")
lh = 70
logo = logo.resize((int(logo.width * lh / logo.height), lh), Image.LANCZOS)
base.alpha_composite(logo, (70, 56))

f_t = ImageFont.truetype(BOLD, 78)
y = 168
for txt, cor in [("Enquanto o mercado", (255, 255, 255)), ("segue o rebanho,", (255, 255, 255)), ("a gente inventa o pasto.", AMARELO)]:
    d.text((70, y), txt, font=f_t, fill=cor)
    y += 92

f_s = ImageFont.truetype(REG, 30)
d.text((70, y + 22), "Growth, marketing, processos e inteligência artificial", font=f_s, fill=(225, 225, 225))
d.text((70, y + 62), "para empresas de serviço crescerem com previsibilidade.", font=f_s, fill=(225, 225, 225))
d.text((70, H - 62), "ecsilab.com.br", font=ImageFont.truetype(BOLD, 28), fill=AMARELO)

saida = os.path.join(RAIZ, "public/og-image.jpg")
base.convert("RGB").save(saida, quality=88, optimize=True, progressive=True)
print("tamanho:", os.path.getsize(saida) // 1024, "KB")
