import React, { ChangeEvent, useEffect, useState, useCallback } from "react"
import * as styles from "./index.module.css"

export default function ThemeSwitcher(props: {
  settingKey: string
  className?: string
  checkboxId?: string
  tooltip?: string
  bodyClassOnDark?: string
  bodyClassOnLight?: string
}) {

  const { settingKey, tooltip } = props

  const PrefersColorScheme = '(prefers-color-scheme: dark)'
  const DarkSettingValue = 'dark'
  const LigthSettingValue = 'light'

  const bodyClassOnDark = props.bodyClassOnDark || 'theme-dark'
  const bodyClassOnLight = props.bodyClassOnLight || 'theme-light'

  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (localStorage) {
      const dark = localStorage.getItem(settingKey)
        ? localStorage.getItem(settingKey) === DarkSettingValue
        : window.matchMedia(PrefersColorScheme).matches
      const inactiveClass = dark ? bodyClassOnLight : bodyClassOnDark
      const activeClass = dark ? bodyClassOnDark : bodyClassOnLight
      document.body.classList.remove(inactiveClass)
      document.body.classList.add(activeClass)
      localStorage.setItem(settingKey, dark ? DarkSettingValue : LigthSettingValue)
      if (dark !== isDark) {
        setIsDark(dark)
      }
    }
  }, [isDark, settingKey])

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.checked ? DarkSettingValue : LigthSettingValue;
    localStorage.setItem(settingKey, val)
    setIsDark(e.currentTarget.checked)
  }, [isDark, settingKey])

  const className = props.className || 'theme-switcher'
  const checkboxId = props.checkboxId || 'theme-switcher'

  return (
    <div className={`${className} ${styles.themeSwitcher}`}>
      <input
        id={checkboxId}
        type="checkbox"
        checked={isDark}
        onChange={onChange}
        />
      <label htmlFor={checkboxId} title={tooltip}/>
    </div>
  )

}
