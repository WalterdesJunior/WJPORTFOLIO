# 🚀 Portfolio — Walterdes Júnior

Portfólio pessoal de **Walterdes Júnior**, Estudante de Engenharia de Software e desenvolvedor Full Stack. Site estático em HTML, CSS e JavaScript puro — sem framework, sem build.

## 📁 Estrutura

```
portfolio-walterdes-final/
├── index.html              ← Página principal (home, sobre, projetos, certificados, contato)
├── README.md               ← Este arquivo
└── assets/
    ├── css/
    │   └── style.css       ← Estilos do site
    ├── js/
    │   └── main.js         ← Lógica (modais de projeto/certificado, contato, animações)
    ├── cv/
    │   └── Walterdes-Junior-CV.pdf ← Currículo para download
    └── img/
        ├── profile.jpeg            ← Foto de perfil
        ├── cert-*.jpg               ← Imagens dos certificados
        └── <pasta-por-projeto>/     ← Screenshots de cada projeto (galeria do modal)
```

## 🚀 Como usar

Como o site faz chamadas `fetch` (formulário de contato via Formspree), o ideal é servir por HTTP em vez de abrir o `index.html` direto como arquivo local:

```bash
python3 -m http.server 8000
```

Ou no VS Code: clique com botão direito em `index.html` → "Open with Live Server".

## 🌐 Deploy gratuito

**GitHub Pages:**
1. Suba a pasta no GitHub
2. Settings → Pages → Branch `main` → Save
3. Seu portfólio fica online!

**Netlify:**
1. Arraste a pasta em netlify.com/drop
2. Pronto — link gerado na hora!

## 📬 Contato

- 📧 walterdinhojuninho@gmail.com
- 📱 (86) 9 9946-0572
- 🐙 github.com/WalterdesJunior
- 📍 Teresina, Piauí — Brasil

---
© 2026 Walterdes Júnior
