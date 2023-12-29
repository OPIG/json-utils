import { useEffect, useState } from 'react'
let fmtTab = 0
function App() {

  const [inputVal, setInputVal] = useState('')
  const [outputVal, setOutputVal] = useState('')
  useEffect(() => { 
    document.querySelectorAll('.expand-tag').forEach((item) => {
      item.querySelector('#tog_flag')?.addEventListener('click', (e) => {
        e.stopPropagation()
        if(e.target.id !== 'tog_flag') return
        let target = e.target.nextSibling
        const ostat = target.style.display == 'none'
        if(ostat) {
          e.target.innerHTML = '-'
          target.style.display = 'block'
        } else {
          e.target.innerHTML = "+ ["+target.children.length+"]";
          target.style.display = 'none'
        }
      }, true)
    })
  })
  const handleChange = (e) => {
    setInputVal(e.target.value)
  }
  const handleInputMouseDown = (e) => {
    if (e.button === 2) {
      if (inputVal == '') {
        setOutputVal('')
        return
      }
      e.preventDefault()
      const jsonObj = JSON.parse(inputVal)
      const tempJson = JSON.stringify(jsonObj, null, fmtTab)
      setInputVal(tempJson)
      fmtTab += 2
      if (fmtTab > 4) {
        fmtTab = 0
      }
    }
  }

  const handleKeyUp = (e) => {
    setInputVal(current => {
      return e.target.value
    })
    fmtJson()
  }
  const fmtJson = () => {
    // debugger
    try {
      if (inputVal == '') {
        setOutputVal('')
        return
      }
      const jsonObj = JSON.parse(inputVal)
      const tempJson = JSON.stringify(jsonObj, null, 4).split('\n')
      let jsonHtml = '<ul>'
      tempJson.forEach((obj, index) => {
        let i = obj.indexOf(':')

        let spanObj = '' // 将内容赋予span并设置样式
        if (i != -1) {
          spanObj =
            '<span class="json_key">' +
            obj.slice(0, i) +
            '</span><span class="json_mh">:</span>' +
            format(obj.slice(i + 1))
        } else {
          if (
            obj.indexOf('{') != -1 ||
            obj.indexOf('[') != -1 ||
            obj.indexOf(']') != -1 ||
            obj.indexOf('}') != -1
          ) {
            spanObj = '<span class="json_kh">' + obj + '</span>'
          } else {
            spanObj = format(obj)
          }
        }

        let lastchar = obj.slice(-1)
        let lastTChar = obj.slice(-2)
        if (lastchar == ',') {
          lastchar = obj.slice(-2, -1)
          lastTChar = obj.slice(-3, -1)
        }

        if (
          lastTChar == '{}' ||
          lastTChar == '[]' ||
          (lastchar != '{' &&
            lastchar != '[' &&
            lastchar != ']' &&
            lastchar != '}')
        ) {
          // 无层
          jsonHtml += '<li>' + spanObj + '</li>'
        } else {
          // 有层
          if (lastchar == '{' || lastchar == '[') {
            // 层级start
            jsonHtml +=
              `<li class="expand-tag">` +
              spanObj +
              "&nbsp;<span id='tog_flag' class='sor'>-</span><ul class='expand-ul'>"
          }
          if (lastchar == '}' || lastchar == ']') {
            // 层级end
            jsonHtml += '</ul>' + spanObj + '</li>'
          }
        }
      })
      jsonHtml += '</ul>'
      setOutputVal(jsonHtml)
    } catch (error) {
      setOutputVal('<ul><span class="json_kh">' + error + '</span><ul>')
    }
  }
  const format = (object) => {
    let fmt_css = 'json_def'
    if (object.indexOf('"') != -1) {
      fmt_css = 'json_char'
    } else if (
      object.indexOf('{') != -1 ||
      object.indexOf('}') != -1 ||
      object.indexOf('[') != -1 ||
      object.indexOf(']') != -1
    ) {
      fmt_css = 'json_kh'
    } else {
      let tobj = object.replace(new RegExp(' ', 'gm'), '')
      tobj = tobj.replace(',', '')
      let nt = Number(tobj)
      if (!isNaN(nt)) {
        fmt_css = 'json_num'
      }
    }
    return '<span class="' + fmt_css + '">' + object + '</span>'
  }

  
  return (
    <div id="content">
      <h1>JSON</h1>
      <div className="container main h100">
        <div className="col-xs-5 main_left h100">
          <textarea
            id="t_json_src"
            placeholder="输入正确的Json字符串"
            data-toggle="tooltip"
            data-content="击右键 格式化~"
            data-placement="top"
            className="form-control borders"
            style={{
              padding: '5px 5px',
              height: '100%',
              width: "100%",
              resize: 'none',
              outline: 'none',
            }}
            onMouseDown={handleInputMouseDown}
            onKeyUp={handleKeyUp}
            value={inputVal}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="col-xs-7 main_right h100">
          <div className="borders json_div h100">
            <span id="t_json_fmt" className="pos_left" dangerouslySetInnerHTML={{__html:outputVal}}></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
