module.exports = {
  "title": "richard's blog",
  "base":'/blogs/',
  "description": null,
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "subSidebar": 'auto',
    "codeTheme": 'tomorrow',
    "valineConfig": {
      "appId": 'Phuf0MFr8D1lMTEyR6To8V5A-9Nh9j0Va',// your appId
      "appKey": 'bwVJhQh5C3zLB9n9cndgXCSy', // your appKey
    },
    "nav": [
      {
        "text": "Home",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "TimeLine",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "Contact",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/gq15760172077/blogs",
            "icon": "reco-github"
          },
          {
            "text": "E-mail",
            "link": "mailto:1249224822@qq.com",
            "icon": "reco-mail"
          },
          {
            "text": "qq",
            "link": "http://wpa.qq.com/msgrd?v=3&uin=1249224822&site=qq&menu=yes",
            "icon": "reco-qq"
          }
        ]
      }
    ],
    "sidebar": {
      "/docs/theme-reco/": [
        "",
        "theme",
        "plugin",
        "api"
      ]
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "Category"
      },
      "tag": {
        "location": 3,
        "text": "Tag"
      }
    },
    "friendLink": [
      // {
      //   "title": "午后南杂",
      //   "desc": "Enjoy when you can, and endure when you must.",
      //   "email": "1156743527@qq.com",
      //   "link": "https://www.recoluan.com"
      // },
      // {
      //   "title": "vuepress-theme-reco",
      //   "desc": "A simple and beautiful vuepress Blog & Doc theme.",
      //   "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      //   "link": "https://vuepress-theme-reco.recoluan.com"
      // }
    ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "gouqi",
    "authorAvatar": "/avatar.jpg",
    "record": "QQ:1249224822",
    "startYear": "2020"
  },
  "markdown": {
    "lineNumbers": true
  }
}
