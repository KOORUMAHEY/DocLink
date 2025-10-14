import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import PropTypes from 'prop-types';

export default function AdminPageHeader({
  title,
  description,
  backLink,
  badge,
  actions,
  stats,
  showRefresh = false,
  onRefresh
}) {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 lg:p-8">
        {/* Back Link */}
        {backLink && (
          <Link 
            href={backLink.href}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {backLink.label}
          </Link>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
          {/* Title Section */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                {title}
              </h1>
              {badge && (
                <Badge 
                  variant={badge.variant || 'default'} 
                  className="text-xs lg:text-sm font-semibold"
                >
                  {badge.text}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-gray-600 text-sm lg:text-base max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {/* Actions Section */}
          {(actions || showRefresh) && (
            <div className="flex flex-wrap items-center gap-3">
              {showRefresh && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onRefresh}
                  className="border-2 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              )}
              {actions && actions.map((action, index) => (
                <div key={index}>
                  {action}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  {Icon && (
                    <div className={`p-2 rounded-lg ${stat.iconBg || 'bg-blue-50'}`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor || 'text-blue-600'}`} />
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

AdminPageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  backLink: PropTypes.shape({
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  badge: PropTypes.shape({
    text: PropTypes.string.isRequired,
    variant: PropTypes.string,
  }),
  actions: PropTypes.arrayOf(PropTypes.node),
  stats: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType,
    iconBg: PropTypes.string,
    iconColor: PropTypes.string,
  })),
  showRefresh: PropTypes.bool,
  onRefresh: PropTypes.func,
};
