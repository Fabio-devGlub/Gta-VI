 const menu = document.getElementById("menu");
 const blocos = document.querySelectorAll(".aparecer");

 const video = document.querySelector(".capa-video");
 const imagemCapa = document.querySelector(".capa-imagem");
 const barraCapa = document.querySelector(".capa-barra"); // adiciona a barra

 window.addEventListener("scroll", function () {

    if(window.scrollY > 50) {
      menu.classList.add("menu-rolado")
    } else {
        menu.classList.remove("menu-rolado")
    }
  
 })

const observador = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visivel");
    }
  });
});

blocos.forEach(function (bloco) {
  observador.observe(bloco);
});




// GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Estado inicial
gsap.set(video, { opacity: 0 });
gsap.set(imagemCapa, { opacity: 1 });
gsap.set(barraCapa, { opacity: 1 });

video.addEventListener("loadedmetadata", () => {
  const duracao = video.duration;

  ScrollTrigger.create({
    trigger: ".capa",
    start: "top top",
    end: "+=4000",
    pin: true,
    scrub: true,
    onUpdate: (self) => {
      // sincroniza o tempo do vídeo com o scroll
      video.currentTime = self.progress * duracao;

      // vídeo aparece conforme o scroll
      gsap.set(video, { opacity: self.progress });

      // imagem e barra desaparecem juntas
      const fade = 1 - self.progress * 4.5; // velocidade mais equilibrada
      gsap.set(imagemCapa, { opacity: Math.max(fade, 0) });
      gsap.set(barraCapa, { opacity: Math.max(fade, 0) });
    },
    onLeave: () => {
      // fundo preto no final
      gsap.to(".capa", {
        backgroundColor: "#000",
        duration: 1.5,
        ease: "power2.inOut",
      });
    },
    onEnterBack: (self) => {
      // restaura suavemente apenas quando o scroll está bem no topo
      if (self.progress < 0.05) {
        gsap.to(video, { opacity: 0, duration: 0.5, ease: "power2.out" });
        gsap.to(imagemCapa, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(barraCapa, { opacity: 1, duration: 0.5, ease: "power2.out" });
        video.currentTime = 0;
      }
      gsap.to(".capa", {
        backgroundColor: "transparent",
        duration: 1,
        ease: "power2.out",
      });
    },
  });
});