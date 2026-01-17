/**
 * エレメント作成
 */
class createElements {
  /**
   * スキルタグを作成
   */
  async skillTags() {
    const targetElement = document.querySelector('#skill-list');
    let data = [];

    //ファイル読み込み
    try {
      const response = await fetch("./doc/engineering-skill.json");
      if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);
      data =  await response.json();
      
    } catch (error) {
      alert('ファイル読み込み失敗:', error);
      return;
    }

    // 表示中のローディングを削除と初期化
    targetElement.innerHTML = "";

    // JSONデータを(group_order, order)の昇順でソート
    const groupPow = Math.pow(10, 3);
    data.sort((a, b) => (a.group_order * groupPow + a.order) - (b.group_order * groupPow + b.order));

    // スキルタグの生成処理
    for(let i = 0; i < data.length; i++){
      // タイプが異なる場合はタイプ見出し新規作成
      if (i === 0 || data[i - 1].type !== data[i].type) {
        const h3 = document.createElement("h3");
        h3.className = "";
        h3.textContent = data[i].type;
        targetElement.appendChild(h3);
      }

      // スキルタグを作成
      const span = document.createElement('span');
      span.className = "skill-tag";
      span.dataset.tech = data[i].key;
      span.textContent = data[i].value;

      // 追加
      targetElement.appendChild(span);
    }
  }

  /**
   * 
   */
  async historyTag(){

  }
}


/**
 * HTML Loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  const skillTags = document.querySelectorAll('.skill-tag');
  const projects = document.querySelectorAll('.project-card');
  const introArea = document.querySelector('.intro-area');

  /**
   * 全スキルを初期状態（アクティブ）にする関数
   */
  const resetSkills = () => {
    skillTags.forEach(tag => {
      tag.classList.remove('inactive');
      tag.classList.add('active');
    });
  };

  /**
   * 特定のスキルだけをハイライトする関数
  */
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

  /**
   * オブザーバーの設定
   * rootMargin: '-45% 0px -45% 0px' とすることで、「画面の中央10%のライン」を通過したものを検知エリアにします。
   * これにより、画面内に複数入っても「中央にあるもの」を判定しやすくなります。
   */
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
  if (introArea) observer.observe(introArea);
  projects.forEach(project => observer.observe(project));

  // 初期ロード時はリセット状態にしておく
  resetSkills();

  new createElements().skillTags();
});