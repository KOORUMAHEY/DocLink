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
  onRefresh,
  icon: Icon,
  gradient = 'from-blue-500 to-cyan-500'
}) {
  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      <div className="bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg border border-slate-700 p-4 sm:p-6 lg:p-8">
        {/* Back Link */}
        {backLink && (
          <Link 
            href={backLink.href}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors group"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform" />
            {backLink.label}
          </Link>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
          {/* Title Section */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
              {Icon && (
                <div className={`hidden sm:flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} shadow-lg flex-shrink-0`}>
                  <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
              )}
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {title}
                </h1>
                {badge && (
                  <Badge 
                    variant={badge.variant || 'default'} 
                    className="text-xs font-semibold"
                  >
                    {badge.text}
                  </Badge>
                )}
              </div>
            </div>
            {description && (
              <p className="text-slate-400 text-xs sm:text-sm lg:text-base max-w-2xl ml-0 sm:ml-[4.5rem] lg:ml-[5rem]">
                {description}
              </p>
            )}
          </div>

          {/* Actions Section */}
          {(actions || showRefresh) && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {showRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="border-2 border-slate-600 hover:bg-slate-700 text-xs sm:text-sm text-slate-300"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              )}
              {actions?.map((action, index) => (
                <div key={`action-${index}`}>
                  {action}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div key={`stat-${stat.label}-${index}`} className="flex items-center gap-2 sm:gap-3">
                  {StatIcon && (
                    <div className={`hidden sm:flex p-2 rounded-lg ${stat.iconBg || 'bg-blue-900/30'} flex-shrink-0`}>
                      <StatIcon className={`h-4 w-4 lg:h-5 lg:w-5 ${stat.iconColor || 'text-blue-400'}`} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 truncate">{stat.label}</p>
                    <p className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">{stat.value}</p>
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
  icon: PropTypes.elementType,
  gradient: PropTypes.string,
};
