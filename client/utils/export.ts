/**
 * Triggers a browser download of a file
 */
export const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * Copies content to clipboard
 */
export const copyToClipboard = async (content: string) => {
    try {
        await navigator.clipboard.writeText(content)
        return true
    } catch (err) {
        console.error('Failed to copy: ', err)
        return false
    }
}

/**
 * Data Transformers
 */

export const transformToJSON = (data: any) => {
    return JSON.stringify(data, null, 2)
}

export const transformToYAML = (data: any[]) => {
    let yaml = ''
    data.forEach(item => {
        yaml += '---\n'
        Object.entries(item).forEach(([key, value]) => {
            if (value !== null && typeof value !== 'object') {
                yaml += `${key}: ${value}\n`
            } else if (value && typeof value === 'object' && 'seconds' in (value as any)) {
                yaml += `${key}: ${new Date((value as any).seconds * 1000).toISOString()}\n`
            }
        })
    })
    return yaml
}

export const transformToXML = (data: any[], rootName: string, itemName: string) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`
    data.forEach(item => {
        xml += `  <${itemName}>\n`
        Object.entries(item).forEach(([key, value]) => {
            if (value !== null && typeof value !== 'object') {
                xml += `    <${key}>${value}</${key}>\n`
            } else if (value && typeof value === 'object' && 'seconds' in (value as any)) {
                xml += `    <${key}>${new Date((value as any).seconds * 1000).toISOString()}</${key}>\n`
            }
        })
        xml += `  </${itemName}>\n`
    })
    xml += `</${rootName}>`
    return xml
}

export const transformToMarkdown = (data: any[], title: string) => {
    if (data.length === 0) return ''

    const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object' || (data[0][k] && 'seconds' in (data[0][k] as any)))

    let md = `# ${title}\n\n`
    md += `| ${headers.join(' | ')} |\n`
    md += `| ${headers.map(() => '---').join(' | ')} |\n`

    data.forEach(item => {
        const row = headers.map(h => {
            const val = item[h]
            if (val && typeof val === 'object' && 'seconds' in (val as any)) {
                return new Date((val as any).seconds * 1000).toLocaleDateString()
            }
            return val ?? ''
        })
        md += `| ${row.join(' | ')} |\n`
    })
    return md
}

export const transformToTXT = (data: any[]) => {
    let txt = ''
    data.forEach((item, index) => {
        txt += `ITEM ${index + 1}\n`
        Object.entries(item).forEach(([key, value]) => {
            if (value !== null && typeof value !== 'object') {
                txt += `${key}: ${value}\n`
            } else if (value && typeof value === 'object' && 'seconds' in (value as any)) {
                txt += `${key}: ${new Date((value as any).seconds * 1000).toISOString()}\n`
            }
        })
        txt += '\n'
    })
    return txt
}

/**
 * Legacy export wrappers (maintained for compatibility if needed, but we'll use composable)
 */
export const exportToJSON = (data: any, filename: string) => triggerDownload(transformToJSON(data), `${filename}.json`, 'application/json')
export const exportToYAML = (data: any[], filename: string) => triggerDownload(transformToYAML(data), `${filename}.yaml`, 'text/yaml')
export const exportToXML = (data: any[], filename: string, rootName: string, itemName: string) => triggerDownload(transformToXML(data, rootName, itemName), `${filename}.xml`, 'application/xml')
export const exportToMarkdown = (data: any[], filename: string, title: string) => triggerDownload(transformToMarkdown(data, title), `${filename}.md`, 'text/markdown')
export const exportToTXT = (data: any[], filename: string) => triggerDownload(transformToTXT(data), `${filename}.txt`, 'text/plain')
