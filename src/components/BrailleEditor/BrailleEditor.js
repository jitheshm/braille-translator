/*  Braille-Translator

    Copyright (C) 2022-2023 Jithesh M <jitheshmjithooz@gmail.com>
    
    V T Bhattathiripad College, Sreekrishnapuram, Kerala, India

    This project supervised by Zendalona(2022-2023) 

    Project Home Page : www.zendalona.com/braille-translator

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/


import { editorsContext, shortcutContext } from '@/pages'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createEditor } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import styles from '../../styles/BrailleEditor.module.css'
import Toolbar from '../Toolbar/Toolbar'
import { withHistory } from 'slate-history'
import braillePattern from '../../../public/braille/braillePattern.txt'
import Find from '../Find/Find'
import FileAndReplace from '../FileAndReplace/FileAndReplace'
function BrailleEditor({ brailleEditor }) {

    const [fontColorPicker, setFontColorPicker] = useState(false)
    const [highlightColorPicker, setHighlightColorPicker] = useState(false)
    const [backgroundPicker, setBackgroundPicker] = useState(false)
    const [background, setBackground] = useState("")
    const [showFind, setShowFind] = useState(false)
    const [showReplace, setShowReplace] = useState(false)
    const [search, setSearch] = useState(null)
    const { braille, setBraille, lineLimit, setLineLimit } = useContext(editorsContext)
    const { brailleEditorFocus, setBrailleEditorFocus } = useContext(shortcutContext)


    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const keys = useRef([])
    const handleChange = (value) => {
        setBraille(value)
        console.log(value);

    }
    const handleKeyDown = (event) => {
        console.log(event.key);

        if (event.keyCode >= 65 && event.keyCode <= 90) {
            event.preventDefault()
            keys.current.push(event.key)
        }


    }



    useEffect(() => {
        if (brailleEditorFocus) {

            ReactEditor.focus(brailleEditor)
        }

    }, [brailleEditorFocus])

    const handleKeyUp = (event) => {
        //console.log(keys.current);
        if (keys.current.length > 0) {
            keys.current = keys.current.map((data) => {
                if (data === 'f' || data === 'F') {
                    return '1'
                } else if (data === 'd' || data === 'D') {
                    return '2'
                }
                else if (data === 's' || data === 'S') {
                    return '3'
                }
                else if (data === 'j' || data === 'J') {
                    return '4'
                }
                else if (data === 'k' || data === 'K') {
                    return '5'
                }
                else if (data === 'l' || data === 'L') {
                    return '6'
                }

            })
            keys.current.sort((a, b) => a - b)
            keys.current = keys.current.join("")
            const patternLines = braillePattern.split('\n')
            patternLines.every((line) => {
                const [key, value] = line.trim().split(' ')
                if (keys.current === key) {
                    brailleEditor.insertText(value)
                    return false
                } else {

                    return true
                }
            })

            keys.current = []
        }
    }


    const Leaf = ({ attributes, children, leaf }) => {

        return <span {...attributes} style={{ ...leaf }}>{children}</span>
    }
    return (<>
        <div className="col-12 col-sm-6">

            <div className={`${styles.brailleEditor} pb-1`}>

                {/* <div className={styles.editorIcon}><a href="#" title="Download">
                    <i className="fas fa-download me-3"></i>
                </a></div> */}
                <Slate editor={brailleEditor} value={braille} onChange={(value) => handleChange(value)} >
                    <Toolbar state={braille} fontColorPicker={fontColorPicker} setFontColorPicker={setFontColorPicker}
                        highlightColorPicker={highlightColorPicker} setHighlightColorPicker={setHighlightColorPicker}
                        background={background} setBackground={setBackground} backgroundPicker={backgroundPicker}
                        setBackgroundPicker={setBackgroundPicker} setShowFind={setShowFind} setShowReplace={setShowReplace}
                        name="braille editor" />
                    <Editable aria-label='braille editor'
                        onClick={() => {
                            fontColorPicker ? setFontColorPicker(false) : null
                            highlightColorPicker ? setHighlightColorPicker(false) : null
                            backgroundPicker ? setBackgroundPicker(false) : null
                        }}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        onFocusCapture={() => { setBrailleEditorFocus(true) }}
                        onBlur={() => { setBrailleEditorFocus(false) }}
                        // renderElement={renderElement}
                        renderLeaf={renderLeaf}


                        className={`${styles.textField} mx-3 p-1`}
                        style={{ backgroundColor: background }} />
                </Slate>
                <div className={`${styles.editorFooter} px-3 py-2`} >
                    <label className="me-2">Line Limit</label>
                    <input style={{ width: '50px' }} type='number' value={lineLimit} onChange={(event) => setLineLimit(Number(event.target.value))} min='1' max='999' />
                </div>


                {showFind && <Find editor={brailleEditor} search={search} setSearch={setSearch} setShowFind={setShowFind} />}
                {showReplace && <FileAndReplace editor={brailleEditor} search={search} setSearch={setSearch} setShowReplace={setShowReplace} />}
            </div>


        </div></>
    )
}

export default BrailleEditor