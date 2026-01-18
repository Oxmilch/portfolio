/**
 * スキルタグ
 */
class skillTag {
  __targetElement;
  __isCreate;
  __skillTags;

  /**
   * コンストラクタ
   */
  constructor(){
    this.__targetElement = document.querySelector('#skill-list');
    this.__isCreate = false;
  }

  /**
   * スキルタグを作成
   */
  async create() {
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
    this.__targetElement.innerHTML = "";

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
        this.__targetElement.appendChild(h3);
      }

      // スキルタグを作成
      const span = document.createElement('span');
      span.className = "skill-tag all";
      span.dataset.tech = data[i].key;
      span.textContent = data[i].value;

      // 追加
      this.__targetElement.appendChild(span);
    }

    this.__isCreate == true;
  }

  /**
   * スタイルを初期化
   */
  styleReset(){
    if (!this.__isCreate) return;
    if (!this.__skillTags) {
      this.__skillTags = this.__targetElement.querySelectorAll(".skill-tag");
    }

    this.__skillTags.forEach(tag => {
      tag.classList.remove('inactive');
      tag.classList.add('active');
    });
  }

  /**
   * スタイルをハイライトする
   * @param {*} techArray ハイライトするtech
   */
  styleActive(techArray){
    this.__skillTags.forEach(tag =>{
      const techName = tag.dataset.tech;
      // techArrayに含まれているなら active, そうでないなら non-active
      if (techArray.includes(techName)) {
        tag.classList.add('active');
        tag.classList.remove('non-active');
      } else {
        tag.classList.add('non-active');
        tag.classList.remove('active');
      }
    });
  }
}

/**
 * プロジェクトカード
 */
class projectCard {
  __targetElement;
  __isCreate;
  __projectCard;

  /**
   *  コンストラクタ
   */
  constructor(){
    this.__targetElement = document.querySelector();
    this.__isCreate = false;
  }

  /**
   * プロジェクト履歴のカードを作成
   */
  async create(){

  }

  /**
   * オブザーバーの設定
   * rootMargin: '-45% 0px -45% 0px' とすることで、「画面の中央10%のライン」を通過したものを検知エリアにします。
   * これにより、画面内に複数入っても「中央にあるもの」を判定しやすくなります。
   */
  observerOptions(){
    root: null;
    // rootMargin: '-45% 0px -45% 0px',
    threshold: 0;
  }
}

/**
 * HTML Loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  const skillTags = new skillTag();
  const projects = document.querySelectorAll('.project-card');
  const introArea = document.querySelector('.intro-area');

  // スキルタグ作成
  skillTags.create();

  // プロジェクト履歴を作成


  /**
   * オブザーバーの設定
   * rootMargin: '-45% 0px -45% 0px' とすることで、「画面の中央10%のライン」を通過したものを検知エリアにします。
   * これにより、画面内に複数入っても「中央にあるもの」を判定しやすくなります。
   */
  const observerOptions = {
    root: null,
    // rootMargin: '-45% 0px -45% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        // イントロエリア（一番上）が見えている時はリセット
        if (entry.target.classList.contains('intro-area')) {
          skillTags.styleReset();
          return;
        }

        // プロジェクトが見えたら、その技術を取得
        const techs = entry.target.dataset.techs;
        if (techs) {
          // カンマ区切りを配列に変換 (例: "go,aws" -> ["go", "aws"])
          const techArray = techs.split(',');
          skillTags.styleActive(techArray);
        }
      }
    });
  }, observerOptions);

  // 監視開始
  if (introArea) observer.observe(introArea);
  projects.forEach(project => observer.observe(project));

});