import tint from '@tunebond/tint'

export type HaltTone = 'rise' | 'fall'

const TONE: Record<HaltTone, Record<string, string>> = {
  fall: {
    base: '#ffffff',
    blue: '#82cdf0',
    gray: '#bebebe',
    green: '#8dd484',
    purple: '#cc9aff',
    red: '#f08296',
    yellow: '#f0dc82',
  },
  rise: {
    base: '#080808',
    blue: '#2db6f3',
    gray: '#808080',
    green: '#26c64f',
    purple: '#af77e7',
    red: '#ff6961',
    yellow: '#ebc300',
  },
}

export type LineListLink = {
  code?: number
  file: string
  line?: number
  task?: string
}

export function makeLinkList(list: Array<string>) {
  const noteLine: Array<string> = []
  const linkList: Array<LineListLink> = []
  // const list = text.trim().split(/\n+/)

  let find = false
  let i = list.length - 1
  while (i >= 0) {
    const line = list[i--]
    if (!find && line?.startsWith('    at ')) {
      const link = readListLine(line.slice('    at '.length))
      if (link) {
        linkList.push(link)
      }
    } else if (line) {
      find = true
      noteLine.push(line)
    }
  }

  return { linkList, note: noteLine }
}

export const makeText = (
  host: string,
  code: string,
  note: string,
  link: Array<string>,
  tone: HaltTone = 'fall',
) => {
  const list: Array<string> = []

  const T = TONE[tone]
  const V = { tone: T.base } // chalk.whiteBright
  const VB = { bold: true, tone: T.base }
  const H = { tone: T.gray }

  list.push(``)
  list.push(tint(`  note <`, H) + tint(`${note}`, VB) + tint('>', H))
  list.push(tint(`    code <`, H) + tint(`${code}`, V) + tint(`>`, H))

  const { linkList } = makeLinkList(link)

  linkList.forEach(link => {
    let head = []
    if (link.line) {
      head.push(link.line)
    }
    if (link.code) {
      head.push(link.code)
    }

    const headText = head.length ? ':' + head.join(':') : ''
    const siteText = tint('site <', H)
    const fileText = tint(`${link.file}${headText}`, VB)
    list.push(`  ${siteText}${fileText}${tint('>', H)}`)

    if (link.task) {
      const callText = tint(`    call <`, H)
      const taskText = tint(link.task, v)
      list.push(`${callText}${taskText}${tint('>', H)}`)
    }
  })

  list.push(``)

  return list.join('\n')
}

export function readListLine(text: string) {
  const [a, b] = text.trim().split(/\s+/)
  if (a && !b) {
    return readListLineFile(a)
  } else if (a && b) {
    return {
      ...readListLineFile(b),
      task: a,
    }
  }
}

export function readListLineFile(text: string): LineListLink {
  const list = text.replace(/[\(\)]/g, '').split(':')
  const code = list.pop()
  let codeMark = code ? parseInt(code, 10) : undefined
  const line = list.pop()
  let lineMark = line ? parseInt(line, 10) : undefined
  let file = list.join(':')
  // if (code.isNumber(lineMark) && code.isNumber(codeMark)) {
  //   ;[file, lineMark, codeMark] = getSourceMappedFile(
  //     file,
  //     lineMark,
  //     codeMark,
  //   )
  // }
  return {
    code: codeMark,
    file,
    line: lineMark,
  }
}

export function saveLinkList(
  halt: Error,
  list: Array<NodeJS.CallSite>,
  tone: HaltTone,
) {
  const T = TONE[tone]
  const V = { tone: T.base }
  const VB = { bold: true, tone: T.base }
  const H = { tone: T.gray }

  return (
    halt.message +
    list
      .slice(1)
      .map((site: NodeJS.CallSite) => {
        let x = site.getFileName()
        let a: number | null | undefined = site.getLineNumber()
        let b: number | null | undefined = site.getColumnNumber()

        let m = site.getMethodName()?.trim()
        let f = site.getFunctionName()?.trim()
        let t = site.getTypeName()?.trim()
        let label = m
          ? [t, m].join('.')
          : t
          ? [t, f].join('.')
          : f || '[anonymous]'
        label = label ? label : ''
        const lastLines: Array<string> = []
        if (x) {
          lastLines.push(
            tint('      site <', H) +
              tint([x, a, b].filter(x => x).join(':'), VB) +
              tint('>', H),
          )
        } else {
          lastLines.push(tint('      site <unknown>', H))
        }

        lastLines.push(
          tint('        call <', H) + tint(label, V) + tint('>', V),
        )

        return lastLines.join('\n')
      })
      .join('\n') +
    '\n'
  )
}
