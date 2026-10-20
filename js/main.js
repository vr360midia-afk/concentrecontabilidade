/**
 * CONCENTRE CONTABILIDADE & CONSULTORIA - JAVASCRIPT PRINCIPAL
 * Funcionalidades: Navegação, FAQ Accordion, Ferramentas Interativas,
 * WhatsApp dinâmico, Modal e Analytics Events.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  initFaqAccordion();
  initModal();
  initTourModal();
  initSimuladorFinanceiro();
  initDiagnosticoMaturidade();
  initCertSelector();
  initChallengeTabs();
  initWhatsAppTracking();
  initScrollTop();
  initLgpdBanner();
});

function initChallengeTabs() {
  const tabs = document.querySelectorAll('.challenge-tab-btn');
  const panes = document.querySelectorAll('.challenge-pane');
  if (!tabs.length || !panes.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}


/* ==========================================================================
   1. HEADER & MOBILE DRAWER
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. FAQ ACCORDION (Acessível)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item, .accordion-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question, .accordion-header');
    const answer = item.querySelector('.faq-answer, .accordion-content');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha outros itens se desejar acordeão estrito
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question, .accordion-header');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Alterna estado atual
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   3. SIMULADOR FINANCEIRO (Consultoria Financeira)
   ========================================================================== */
function initSimuladorFinanceiro() {
  const simContainer = document.getElementById('simulador-financeiro');
  if (!simContainer) return;

  const receitaInput = document.getElementById('calc-receita');
  const receitaSlider = document.getElementById('slider-receita');
  const custosInput = document.getElementById('calc-custos');
  const custosSlider = document.getElementById('slider-custos');
  const despesasInput = document.getElementById('calc-despesas');
  const despesasSlider = document.getElementById('slider-despesas');

  // Outputs
  const outMargemContrib = document.getElementById('out-margem-contrib');
  const outMargemPerc = document.getElementById('out-margem-perc');
  const outPontoEquilibrio = document.getElementById('out-ponto-equilibrio');
  const outResultado = document.getElementById('out-resultado');
  const outResultadoPerc = document.getElementById('out-resultado-perc');
  const outStatus = document.getElementById('out-status-text');

  function parseVal(val) {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }

  function formatBRL(num) {
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    });
  }

  function updateCalculations() {
    const receita = parseVal(receitaInput.value);
    const custos = parseVal(custosInput.value);
    const despesas = parseVal(despesasInput.value);

    // Margem de Contribuição
    const margemContrib = Math.max(0, receita - custos);
    const margemPerc = receita > 0 ? (margemContrib / receita) * 100 : 0;

    // Ponto de Equilíbrio = Despesas Fixas / Margem de Contribuição %
    let pontoEquilibrio = 0;
    if (margemPerc > 0) {
      pontoEquilibrio = despesas / (margemPerc / 100);
    }

    // Resultado
    const resultado = margemContrib - despesas;
    const resultadoPerc = receita > 0 ? (resultado / receita) * 100 : 0;

    // Atualiza DOM
    if (outMargemContrib) outMargemContrib.textContent = formatBRL(margemContrib);
    if (outMargemPerc) outMargemPerc.textContent = `${margemPerc.toFixed(1)}% da receita`;
    if (outPontoEquilibrio) outPontoEquilibrio.textContent = formatBRL(pontoEquilibrio);
    if (outResultado) {
      outResultado.textContent = formatBRL(resultado);
      outResultado.style.color = resultado >= 0 ? '#10B981' : '#EF4444';
    }
    if (outResultadoPerc) {
      outResultadoPerc.textContent = `${resultadoPerc.toFixed(1)}% de margem líquida operacional`;
    }

    if (outStatus) {
      if (resultado < 0) {
        outStatus.innerHTML = `⚠️ <strong>Operação deficitária:</strong> A empresa precisa faturar ao menos <strong>${formatBRL(pontoEquilibrio)}</strong> para atingir o ponto de equilíbrio.`;
        outStatus.style.color = '#EF4444';
      } else if (receita < pontoEquilibrio * 1.15) {
        outStatus.innerHTML = `⚡ <strong>Atenção à margem de segurança:</strong> Seu faturamento está muito próximo do ponto de equilíbrio (${formatBRL(pontoEquilibrio)}). Qualquer oscilação pode gerar prejuízo.`;
        outStatus.style.color = '#F59E0B';
      } else {
        outStatus.innerHTML = `✅ <strong>Operação superavitária:</strong> Margem de contribuição saudável. O ponto de equilíbrio é de ${formatBRL(pontoEquilibrio)}.`;
        outStatus.style.color = '#10B981';
      }
    }
  }

  // Sincroniza inputs e sliders
  function bindPair(input, slider) {
    if (!input || !slider) return;
    input.addEventListener('input', () => {
      slider.value = input.value;
      updateCalculations();
    });
    slider.addEventListener('input', () => {
      input.value = slider.value;
      updateCalculations();
    });
  }

  bindPair(receitaInput, receitaSlider);
  bindPair(custosInput, custosSlider);
  bindPair(despesasInput, despesasSlider);

  // Executa primeira vez
  updateCalculations();
}

/* ==========================================================================
   4. DIAGNÓSTICO DE MATURIDADE FINANCEIRA (BPO Financeiro)
   ========================================================================== */
function initDiagnosticoMaturidade() {
  const diagContainer = document.getElementById('diagnostico-bpo');
  if (!diagContainer) return;

  const form = document.getElementById('diagnostic-form');
  const resultCard = document.getElementById('diag-result-card');
  const resultScore = document.getElementById('diag-score-title');
  const resultText = document.getElementById('diag-score-text');
  const resultWppBtn = document.getElementById('diag-wpp-btn');

  if (!form || !resultCard) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const q1 = parseInt(form.querySelector('input[name="q1"]:checked')?.value || '0');
    const q2 = parseInt(form.querySelector('input[name="q2"]:checked')?.value || '0');
    const q3 = parseInt(form.querySelector('input[name="q3"]:checked')?.value || '0');
    const q4 = parseInt(form.querySelector('input[name="q4"]:checked')?.value || '0');
    const q5 = parseInt(form.querySelector('input[name="q5"]:checked')?.value || '0');

    // Validação
    if (!q1 || !q2 || !q3 || !q4 || !q5) {
      alert('Por favor, responda todas as 5 perguntas para gerar seu diagnóstico de maturidade.');
      return;
    }

    const total = q1 + q2 + q3 + q4 + q5; // Max 15, Min 5

    let nivel = '';
    let descricao = '';
    let cor = '';

    if (total <= 7) {
      nivel = 'Nível 1 — Crítico / Rotina Manual Sobrecargada';
      cor = '#EF4444';
      descricao = 'Sua empresa opera com alto risco de inconsistências bancárias, dependência do gestor para tarefas operacionais e pouca previsibilidade de fluxo de caixa. O BPO Financeiro da Concentre pode assumir as rotinas imediatamente, liberando seu tempo e organizando seus compromissos.';
    } else if (total <= 11) {
      nivel = 'Nível 2 — Em Transição / Controles Parciais';
      cor = '#F59E0B';
      descricao = 'Você possui boa consciência da rotina, mas gasta tempo precioso com lançamentos, conciliação e conferência de notas. A padronização de processos da Concentre trará previsibilidade e relatórios gerenciais profissionais.';
    } else {
      nivel = 'Nível 3 — Estruturado / Pronto para Inteligência Estratégica';
      cor = '#10B981';
      descricao = 'Sua rotina financeira básica está organizada. O próximo passo ideal para sua empresa é a integração fina com a contabilidade consultiva e análises de indicadores para maximizar rentabilidade.';
    }

    resultScore.textContent = nivel;
    resultScore.style.color = cor;
    resultText.textContent = descricao;

    // Configura mensagem do WhatsApp com o resultado
    const msg = encodeURIComponent(`Olá, Concentre! Realizei o Diagnóstico de Maturidade Financeira no site e obtive a pontuação: ${nivel}. Gostaria de entender como o BPO Financeiro pode apoiar minha empresa em Maceió.`);
    if (resultWppBtn) {
      resultWppBtn.href = `https://wa.me/558232026489?text=${msg}`;
    }

    resultCard.classList.add('visible');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ==========================================================================
   5. SELETOR INTERATIVO DE CERTIFICADO DIGITAL
   ========================================================================== */
function initCertSelector() {
  const container = document.getElementById('cert-selector');
  if (!container) return;

  const titularBtns = container.querySelectorAll('.btn-titular');
  const formatoBtns = container.querySelectorAll('.btn-formato');
  const resultTitle = document.getElementById('cert-rec-title');
  const resultDesc = document.getElementById('cert-rec-desc');
  const resultValidade = document.getElementById('cert-rec-validade');
  const resultDocs = document.getElementById('cert-rec-docs');
  const resultBtn = document.getElementById('cert-rec-wpp');

  let selectedTitular = 'pj'; // 'pf' ou 'pj'
  let selectedFormato = 'a1'; // 'a1' ou 'a3'

  function updateRecommendation() {
    let title = '';
    let desc = '';
    let validade = '';
    let docs = '';

    if (selectedTitular === 'pj' && selectedFormato === 'a1') {
      title = 'Certificado e-CNPJ A1 (Arquivo / Software)';
      desc = 'Instalado diretamente no computador ou servidor emissor de notas fiscais (NFe/NFS-e). Ideal para clínicas, comércios e empresas de serviços que necessitam de emissão automatizada e agilidade no dia a dia.';
      validade = 'Validade: 1 ano (renovação anual ágil)';
      docs = 'Documentos: Contrato Social ou Certificado MEI, documento de identificação com foto do responsável perante a Receita e cartão CNPJ.';
    } else if (selectedTitular === 'pj' && selectedFormato === 'a3') {
      title = 'Certificado e-CNPJ A3 (Token Físico ou Cartão)';
      desc = 'Armazenado em dispositivo criptográfico portátil (Token USB ou Cartão com leitora). Máxima segurança física para operações bancárias específicas, judiciais e acessos que exigem posse da mídia.';
      validade = 'Validade: de 1 a 3 anos';
      docs = 'Documentos: Atos societários completos, documento do titular e presença física ou videoconferência ICP-Brasil.';
    } else if (selectedTitular === 'pf' && selectedFormato === 'a1') {
      title = 'Certificado e-CPF A1 (Arquivo Digital)';
      desc = 'Identificação digital da pessoa física instalada em seu notebook ou desktop. Muito prático para médicos, advogados, contadores e administradores assinarem documentos e laudos com rapidez.';
      validade = 'Validade: 1 ano';
      docs = 'Documentos: Documento oficial com foto (RG ou CNH) e comprovante de endereço recente.';
    } else {
      title = 'Certificado e-CPF A3 (Token ou Cartão)';
      desc = 'Assinatura digital de pessoa física com validade estendida em token criptográfico. Muito utilizado por profissionais liberais que realizam peticionamento ou acessam sistemas judiciais restritos.';
      validade = 'Validade: de 1 a 3 anos';
      docs = 'Documentos: RG/CNH do titular e validação presencial ou videoconferência oficial.';
    }

    if (resultTitle) resultTitle.textContent = title;
    if (resultDesc) resultDesc.textContent = desc;
    if (resultValidade) resultValidade.textContent = validade;
    if (resultDocs) resultDocs.textContent = docs;

    const msg = encodeURIComponent(`Olá! Utilizei o guia interativo no site e gostaria de solicitar informações e emissão para o: ${title} com a Concentre Contabilidade em Maceió.`);
    if (resultBtn) {
      resultBtn.href = `https://wa.me/558232026489?text=${msg}`;
    }
  }

  titularBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      titularBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTitular = btn.dataset.value;
      updateRecommendation();
    });
  });

  formatoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      formatoBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFormato = btn.dataset.value;
      updateRecommendation();
    });
  });

  updateRecommendation();
}

/* ==========================================================================
   6. MODAL DE CONTATO / PROPOSTA RÁPIDA
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('contact-modal');
  const openBtns = document.querySelectorAll('[data-open-modal], .open-modal-btn');
  const closeBtn = document.querySelector('.modal-close');

  if (!modal) return;

  function openModal(serviceName) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (serviceName) {
      const select = modal.querySelector('select[name="servico"], select#form-service');
      if (select) {
        select.value = serviceName;
      }
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.dataset.service || '';
      openModal(service);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  const form = document.getElementById('modal-form') || document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = form.querySelector('input[name="nome"], #form-name')?.value || '';
      const empresa = form.querySelector('input[name="empresa"]')?.value || '';
      const fone = form.querySelector('input[name="telefone"], #form-phone')?.value || '';
      const servico = form.querySelector('select[name="servico"], #form-service')?.value || '';

      const empStr = empresa ? ` da empresa ${empresa}` : '';
      const text = encodeURIComponent(`Olá! Meu nome é ${nome}${empStr}. Gostaria de solicitar consultoria para a solução: ${servico}. Meu WhatsApp é ${fone}.`);
      window.open(`https://wa.me/558232026489?text=${text}`, '_blank');
      closeModal();
    });
  }
}

/* ==========================================================================
   7. WHATSAPP & CONVERSION TRACKING (GA4 EVENT DISPATCH)
   ========================================================================== */
function initWhatsAppTracking() {
  const wppLinks = document.querySelectorAll('a[href*="wa.me"]');
  wppLinks.forEach(link => {
    link.addEventListener('click', () => {
      const pageTitle = document.title;
      const href = link.getAttribute('href');

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'WhatsApp',
          event_label: pageTitle,
          link_url: href
        });
      }
    });
  });
}

/* ==========================================================================
   8. TOUR VIRTUAL 360° POPUP TELA CHEIA (TudoEm360)
   ========================================================================== */
function initTourModal() {
  const modal = document.getElementById('tour-modal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('[data-tour-open], .open-tour-modal');
  const closeBtn = document.getElementById('tour-close-btn');
  const iframe = document.getElementById('tour-iframe');
  const spinner = document.getElementById('tour-spinner');
  const fullscreenBtn = document.getElementById('tour-fullscreen-btn');
  const tourUrl = 'https://tour.tudoem360.com.br/concentrecontabilidade/';

  function openTour() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Carregamento sob demanda do iframe do Tour
    if (iframe) {
      if (!iframe.src || iframe.src === 'about:blank' || iframe.src === window.location.href) {
        if (spinner) spinner.classList.remove('loaded');
        iframe.src = tourUrl;
        iframe.onload = () => {
          if (spinner) spinner.classList.add('loaded');
        };
      } else {
        if (spinner) spinner.classList.add('loaded');
      }
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'view_virtual_tour', {
        event_category: 'Virtual Tour 360',
        event_label: 'Conheca a Sede Farol Maceio'
      });
    }
  }

  function closeTour() {
    modal.classList.remove('open');
    document.body.style.overflow = '';

    // Se estiver em modo tela cheia do navegador, sai
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  function toggleFullscreen() {
    const container = modal.querySelector('.tour-modal-container') || modal;
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openTour();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeTour);
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTour();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeTour();
    }
  });
}

/* ==========================================================================
   9. VOLTAR AO TOPO (Scroll-to-Top)
   ========================================================================== */
function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 400) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   10. CONSENTIMENTO LGPD & PRIVACIDADE
   ========================================================================== */
function initLgpdBanner() {
  const banner = document.getElementById('lgpd-banner');
  if (!banner) return;

  const acceptBtn = document.getElementById('lgpd-accept-btn');
  const hasAccepted = localStorage.getItem('concentre_lgpd_accepted');

  if (!hasAccepted) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 1200);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('concentre_lgpd_accepted', 'true');
      banner.classList.remove('show');
      setTimeout(() => {
        banner.style.display = 'none';
      }, 400);
    });
  }
}

