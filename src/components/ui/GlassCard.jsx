export function GlassCard({ children, className = '', as: Tag = 'article', ...props }) {
  return (
    <Tag className={`glass-card ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
