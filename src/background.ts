export {}
// 右键开启
chrome.contextMenus.create({
  id: 'open-xinghuo-chat',
  title: '打开星火聊天侧边栏',
  type: 'normal',
  contexts: ['page', 'frame'],
})
// 右键选中搜索
chrome.contextMenus.create({
  id: 'search-xinghuo-chat',
  title: '使用星火chat搜索选中文字',
  type: 'normal',
  contexts: ['selection'],
})
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'open-xinghuo-chat') {
    ;(chrome.sidePanel as any).open({
      tabId: tab.id,
    })
  }
  if (info.menuItemId === 'search-xinghuo-chat') {
    ;(chrome.sidePanel as any)
      .open({
        tabId: tab.id,
      })
      .then(() => {
        // 发送填充内容消息，直到侧边栏加载完成并且填充内容成功
        const id = setInterval(() => {
          const content = info.selectionText
          chrome.runtime
            .sendMessage({
              type: 'search',
              content,
            })
            .then((res) => {
              if (res.status === 'success') {
                clearInterval(id)
              }
            })
            .catch(() => {})
        }, 100)
      })
  }
})
