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
      const response = await fetch("./doc/data/engineering-skill.json");
      if (!response.ok) throw new Error("スキルセットのファイル読み込みに失敗");
      data =  await response.json();
    } catch (error) {
      alert("Webページの読み込みに失敗しました。時間をおいて再度アクセスしてください。");
      return;
    }
    // JSONデータを(group_order, order)の昇順でソート
    const groupPow = Math.pow(10, 3);
    data.sort((a, b) => (a.group_order * groupPow + a.order) - (b.group_order * groupPow + b.order));

    // 表示中のローディングを削除と初期化
    this.__targetElement.innerHTML = "";

    // スキルタグの生成処理
    data.forEach((value, i) => {
      // タイプが異なる場合はタイプ見出し新規作成
      if (i === 0 || data[i - 1].type !== value.type) {
        const h3 = document.createElement("h3");
        h3.className = "";
        h3.textContent = value.type;
        this.__targetElement.appendChild(h3);
      }

      // スキルタグを作成
      const span = document.createElement('span');
      span.className = "skill-tag all";
      span.dataset.tech = value.key;
      span.textContent = value.value;

      // 追加
      this.__targetElement.appendChild(span);
    });

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
  __projectCard;

  /**
   *  コンストラクタ
   */
  constructor(){
    this.__targetElement = document.querySelector("#project-list");
    this.__isCreate = false;
  }

  /**
   * プロジェクト履歴のカードを作成
   */
  async create(){
    let process = [];
    let skills = [];
    let data = [];

    try {
      // 工程のファイル読み込み
      const response1 = await fetch("./doc/data/engineering-process.json");
      if (!response1.ok) throw new Error("工程ファイルの読み込みに失敗");
      process =  await response1.json();

      // スキルセットのファイル読み込み
      const response2 = await fetch("./doc/data/engineering-skill.json");
      if (!response2.ok) throw new Error("スキルセットのファイル読み込みに失敗");
      skills =  await response2.json();
      // JSONデータを(group_order, order)の昇順でソート
      const groupPow = Math.pow(10, 3);
      skills.sort((a, b) => (a.group_order * groupPow + a.order) - (b.group_order * groupPow + b.order));

      // プロジェクト履歴のファイル読み込み
      const response3 = await fetch("./doc/data/enginnering-history.json");
      if (!response3.ok) throw new Error("プロジェクト履歴のファイル読み込みに失敗");
      data =  await response3.json();
    } catch (error) {
      alert("Webページの読み込みに失敗しました。時間をおいて再度アクセスしてください。");
      return;
    }

    // プロジェクト履歴の初期化
    this.__targetElement.innerHTML = "";

    // プロジェクトカードの生成処理
    data.forEach((value) => {
      // カード作成
      const article = document.createElement("article");

      // 見出し作成
      const h3 = document.createElement("h3");
      h3.textContent = value.title;
      article.appendChild(h3);

      // 業種
      const span_industry = document.createElement("span");
      span_industry.textContent = value.industry;
      article.appendChild(span_industry);

      // 時期作成
      const timeTag = document.createElement("time");
      timeTag.dateTime = value.date;
      const startDate = new Date(value.date);
      if (value.period == null || value.period < 1) {
        timeTag.textContent = `${startDate.getFullYear()}年${startDate.getMonth() + 1}月〜`;
      } else if (value.period == 1) {
        timeTag.textContent = `${startDate.getFullYear()}年${startDate.getMonth() + 1}月`;
      } else {
        const endDateMonth = ((startDate.getMonth() + value.period) % 12) - 1;
        const endDateYear = startDate.getFullYear() + Math.trunc(((startDate.getMonth() + value.period) / 12));
        const endDate = new Date(endDateYear, endDateMonth, 1);
        timeTag.textContent = `${startDate.getFullYear()}年${startDate.getMonth() + 1}月〜${endDate.getFullYear()}年${endDate.getMonth() + 1}月`;
      }
      article.appendChild(timeTag);

      // 作業工程
      const ul = document.createElement("ul");
      process.forEach((procValue) => {
        const li = document.createElement("li");
        li.textContent = procValue.name;
        if(value.process.filter((v) => v == procValue.key).length == 1) li.className = "enable";
        ul.appendChild(li);
      });
      article.appendChild(ul);

      // スキルセット
      const dataTechs = [];
      const divSkills = document.createElement("div");
      divSkills.classList = "project-skills";
      skills.forEach((skill) => {
        if(Object.values(value.skill).filter(a => a.find(v => v == skill.key)).length == 1) {
          const span = document.createElement("span");
          span.className = "skill-tag all";
          span.textContent = skill.value;
          divSkills.appendChild(span);
          dataTechs.push(skill);
        }
      });
      article.dataset.name = "techs";
      article.dataset.techs = dataTechs.join(",");
      article.appendChild(divSkills);

      // 本文
      const p = document.createElement("p");
      p.textContent = value.body;
      article.appendChild(p);

      // 追加
      this.__targetElement.appendChild(article);
    });
  }
}

/**
 * HTML Loaded Event
 */
document.addEventListener('DOMContentLoaded', () => {
  const skillTags = new skillTag();
  const projects = new projectCard();
  const introArea = document.querySelector('.intro-area');

  // スキルタグ作成
  skillTags.create();

  // プロジェクト履歴を作成
  projects.create();

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
  // if (introArea) observer.observe(introArea);
  // projects.forEach(project => observer.observe(project));

});