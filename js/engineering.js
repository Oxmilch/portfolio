document.addEventListener('DOMContentLoaded', () => {
  const skillTags = document.querySelectorAll('.skill-tag');
  const projects = document.querySelectorAll('.project-card');
  const introArea = document.querySelector('.intro-area');

  // 全スキルを初期状態（アクティブ）にする関数
  const resetSkills = () => {
    skillTags.forEach(tag => {
      tag.classList.remove('inactive');
      tag.classList.add('active');
    });
  };

  // 特定のスキルだけをハイライトする関数
  const highlightSkills = (techArray) => {
    skillTags.forEach(tag => {
      const techName = tag.dataset.tech;
      // techArrayに含まれているなら active, そうでないなら inactive
      if (techArray.includes(techName)) {
        tag.classList.add('active');
        tag.classList.remove('inactive');
      } else {
        tag.classList.add('inactive');
        tag.classList.remove('active');
      }
    });
  };

  // オブザーバーの設定
  // rootMargin: '-45% 0px -45% 0px' とすることで、
  // 「画面の中央10%のライン」を通過したものを検知エリアにします。
  // これにより、画面内に複数入っても「中央にあるもの」を判定しやすくなります。
  const observerOptions = {
    root: null,
    rootMargin: '-45% 0px -45% 0px', 
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        
        // イントロエリア（一番上）が見えている時はリセット
        if (entry.target.classList.contains('intro-area')) {
          resetSkills();
          return;
        }

        // プロジェクトが見えたら、その技術を取得
        const techs = entry.target.dataset.techs;
        if (techs) {
          // カンマ区切りを配列に変換 (例: "go,aws" -> ["go", "aws"])
          const techArray = techs.split(',');
          highlightSkills(techArray);
        }
      }
    });
  }, observerOptions);

  // 監視開始
  if(introArea) observer.observe(introArea);
  projects.forEach(project => observer.observe(project));
  
  // 初期ロード時はリセット状態にしておく
  resetSkills();
});