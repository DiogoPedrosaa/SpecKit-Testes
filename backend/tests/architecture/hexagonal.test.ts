import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

function getFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList)
    } else if (filePath.endsWith('.ts')) {
      fileList.push(filePath)
    }
  }
  return fileList
}

describe('Hexagonal Architecture', () => {
  it('should ensure domain and application layers do not import from adapters or main', () => {
    const modulesDir = path.resolve(__dirname, '../../src/modules')
    if (!fs.existsSync(modulesDir)) return

    const modules = fs.readdirSync(modulesDir)
    
    for (const mod of modules) {
      const domainDir = path.join(modulesDir, mod, 'domain')
      const applicationDir = path.join(modulesDir, mod, 'application')
      
      const filesToCheck = [
        ...getFiles(domainDir),
        ...getFiles(applicationDir)
      ]

      for (const file of filesToCheck) {
        const content = fs.readFileSync(file, 'utf-8')
        const lines = content.split('\n')
        for (const line of lines) {
          if (line.startsWith('import ')) {
            // Assert no dependency pointing outwards
            expect(line).not.toMatch(/\/adapters\//)
            expect(line).not.toMatch(/\/main\//)
            expect(line).not.toMatch(/fastify/)
            expect(line).not.toMatch(/mongodb/)
          }
        }
      }
    }
  })
})
