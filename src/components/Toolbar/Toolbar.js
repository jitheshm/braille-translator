import React, { useEffect, useMemo, useState } from 'react'
import styles from '../../styles/Toolbar.module.css'

import { ChromePicker } from 'react-color';
import { Editor } from 'slate';
import { useFocused, useSelected, useSlate } from 'slate-react';
function Toolbar() {
  const [fontColor, setFontColor] = useState("#000000")
  const editor = useSlate();

  //console.log(editor);
  const [showColorPicker, setShowColorPicker] = useState(false)

  const fontColorChange = (color) => {
    setFontColor(color.hex)
    console.log(color);
    Editor.addMark(editor, 'color', color.hex);

  }


  useEffect(() => {
    let same = true;

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      console.log(selection.rangeCount);
      const range = selection.getRangeAt(0);

      const nodes = [];
      let currentNode = range.startContainer.parentNode.parentNode.parentNode;

      while (currentNode !== range.endContainer.parentNode.parentNode.parentNode.nextSibling) {

        nodes.push(currentNode);
        currentNode = currentNode.nextSibling;

      }
      console.log(nodes.length);
      const styles = [];
      for (let i = 0; i < nodes.length; i++) {
        const stylesObj = {};
        const nodeStyles = window.getComputedStyle(nodes[i].childNodes[0]);
        stylesObj.color = nodeStyles.getPropertyValue('color');
        console.log(stylesObj.color);
        if (styles.length != 0) {
          if (stylesObj.color === styles[0].color) {
            styles.push(stylesObj);
          }
          else {
            same = false
            break;
          }
        } else {
          styles.push(stylesObj);
        }
      }
      if (same) {
        setFontColor(styles[0].color)

      }
      else {
        setFontColor("")
      }
    }




  }, [editor.selection])






  return (

    <div className={`${styles.toolbox} container-fluid`}>


      <div className={`${styles.tools} px-3 col-12`}>
        <div className={`${styles.toolContainer} pe-1`}>
          <div><a href="#" title="Open"><i className="fa fa-folder-open"></i></a></div>
          <div><a href="#" title="Undo"><i className="fas fa-undo"></i></a></div>
          <div><a href="#" title="Redo"><i className="fas fa-redo"></i></a></div>
        </div>
        <div className={`${styles.toolContainer} pe-1`}>
          <div><a onClick={() => setShowColorPicker(!showColorPicker)} title="font"><i className="fas fa-font">
            <div className={styles.fontColor} style={{ background: fontColor }}></div>


          </i></a></div>
        </div>

      </div>
      {showColorPicker && <div className={styles.colorPicker}> <ChromePicker color={fontColor} onChange={(color) => fontColorChange(color)} /> </div>}
    </div>
  )
}

export default Toolbar