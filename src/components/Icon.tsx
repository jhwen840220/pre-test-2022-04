import { useState, useEffect } from "react";

const defaultWidth = 20;
const defaultHeight = 20;

interface Props {
  name: string
  width: string | number
  height: string | number
  fill?: string
  title?: string
  svgClassName?: string
}

interface File {
  viewBox?: string
  id?: string
}

interface SvgSize {
  width: undefined | string | number
  height: undefined | string | number
}
const Icon = ({ name, width, height, fill, title, svgClassName }: Props) => {

  const [file, setFile] = useState<File>({})
  useEffect(() => {
    import(
      /* webpackChunkName: "IconSVG" */
      /* webpackMode: "eager" */
      `~svg/${name}.svg`
    ).then(res => setFile(res.default));
  }, [])

  const [svgSize, setSvgSize] = useState<SvgSize>({
    width: undefined,
    height: undefined
  })

  useEffect(() => {
    if (file.viewBox) {
      const viewBoxArr = file.viewBox.split(" ");
      setSvgSize({
        width: width ? width : viewBoxArr.length >= 3 ? parseInt(viewBoxArr[2]) : defaultWidth,
        height: height ? height : viewBoxArr.length >= 4 ? parseInt(viewBoxArr[3]) : defaultHeight
      })
    }
  }, [file])

  return (
    <svg
      viewBox={file.viewBox}
      width={svgSize.width}
      height={svgSize.height}
      fill={fill}
      aria-label={title}
      className={svgClassName}
    >
      {title && <title>{title}</title>}
      <use xlinkHref={`#${file.id}`} />
    </svg>
  )
}
export default Icon;