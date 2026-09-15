import { PERSONAL, ABOUT, TECH_STACK, EXPERIENCE, PROJECTS, CERTIFICATIONS, EDUCATION } from '../data/portfolioData.js';

const document = (name, content) => ({ id: `doc:${name.split('.')[0]}`, title: name, content, language: name.endsWith('.json') ? 'JSON' : 'Markdown', icon: 'description', folder: 'portfolio' });
const bullet = (text) => `- ${typeof text === 'string' ? text : text.text}`;

// Portfolio data remains the source of truth for both shells and AI context.
export const DOCUMENTS = [
  document('about.md', `# ${PERSONAL.name}\n\n${PERSONAL.role}\n\n${ABOUT.paragraphs.join('\n\n')}\n\n## Availability\n\n${PERSONAL.status}\n\n## Location\n\n${PERSONAL.location}`),
  document('experience.md', `# Experience\n\n${EXPERIENCE.map((job) => `## ${job.company}\n\n**${job.title}** · ${job.period} · ${job.location}\n\n${job.description.map(bullet).join('\n')}\n\nTechnologies: ${job.tags.join(', ')}`).join('\n\n')}`),
  document('skills.json', JSON.stringify(Object.fromEntries(TECH_STACK.map((group) => [group.title, group.items])), null, 2)),
  document('projects.md', `# Projects\n\n${PROJECTS.map((project) => `## ${project.title}\n\n${project.description}${project.tags ? `\n\nTechnologies: ${project.tags.join(', ')}` : ''}${project.status ? `\n\nStatus: ${project.status}` : ''}`).join('\n\n')}`),
  document('credentials.md', `# Credentials\n\n## Education\n\n${EDUCATION.map((item) => `### ${item.institution}\n\n${item.degree}\n\n${item.detail}\n\nCoursework: ${item.coursework}`).join('\n\n')}\n\n## Technical expertise\n\n${CERTIFICATIONS.map((item) => bullet(item.name)).join('\n')}`),
  document('contact.md', `# Contact\n\n${PERSONAL.name}\n\n- Email: [${PERSONAL.email}](mailto:${PERSONAL.email})\n- Phone: ${PERSONAL.phone}\n- Location: ${PERSONAL.location}\n${Object.entries(PERSONAL.socialLinks).map(([label, url]) => `- [${label}](${url})`).join('\n')}${PERSONAL.resumeUrl !== '#' ? `\n- [Resume](${PERSONAL.resumeUrl})` : ''}${PERSONAL.calendlyUrl !== '#' ? `\n- [Schedule a conversation](${PERSONAL.calendlyUrl})` : ''}`),
];

export function getDocument(id) {
  return DOCUMENTS.find((item) => item.id === id || item.title === id || item.id.slice(4) === id) ?? null;
}

export function searchDocuments(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return DOCUMENTS.flatMap((document) => document.content.split('\n').flatMap((text, index) => text.toLowerCase().includes(needle) ? [{ id: `${document.id}:${index + 1}`, documentId: document.id, title: document.title, line: index + 1, text }] : []));
}
