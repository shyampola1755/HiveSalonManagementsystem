'use client';

import * as React from 'react';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Globe,
  Layers,
  Map,
} from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '@hive/utilities';

export interface HierarchyBranchNode {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  status: string;
  isMain?: boolean;
}

export interface HierarchyCityNode {
  id: string;
  name: string;
  code: string;
  status: string;
  branches: HierarchyBranchNode[];
}

export interface HierarchyDistrictNode {
  id: string;
  name: string;
  code: string;
  status: string;
  cities: HierarchyCityNode[];
}

export interface HierarchyStateNode {
  id: string;
  name: string;
  code: string;
  status: string;
  districts: HierarchyDistrictNode[];
}

export interface HierarchyTreeProps {
  countryName?: string;
  states: HierarchyStateNode[];
  onAddState?: () => void;
  onAddDistrict?: (stateId: string) => void;
  onAddCity?: (stateId: string, districtId: string) => void;
  onAddBranch?: (cityId: string) => void;
  onSelectBranch?: (branch: HierarchyBranchNode) => void;
  className?: string;
}

export const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  countryName = 'India (Default Localization)',
  states,
  onAddState,
  onAddDistrict,
  onAddCity,
  onAddBranch,
  onSelectBranch,
  className,
}) => {
  const [expandedStates, setExpandedStates] = React.useState<Record<string, boolean>>({
    all: true,
  });
  const [expandedDistricts, setExpandedDistricts] = React.useState<Record<string, boolean>>({
    all: true,
  });
  const [expandedCities, setExpandedCities] = React.useState<Record<string, boolean>>({
    all: true,
  });

  const toggleState = (id: string) => {
    setExpandedStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDistrict = (id: string) => {
    setExpandedDistricts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCity = (id: string) => {
    setExpandedCities((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={cn('space-y-4 text-left', className)}>
      {/* Country Root Card */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shadow-sm">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{countryName}</h3>
              <Badge variant="default">National Region</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {states.length} Active States • Master Tenant Geographical Hierarchy
            </p>
          </div>
        </div>

        {onAddState && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={onAddState}
          >
            Add State / Region
          </Button>
        )}
      </div>

      {/* States Tree List */}
      <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-amber-500/20">
        {states.map((st) => {
          const isStateOpen = expandedStates[st.id] !== false;

          return (
            <div
              key={st.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 overflow-hidden shadow-xs"
            >
              {/* State Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleState(st.id)}
                  className="flex items-center gap-2.5 text-left flex-1"
                >
                  {isStateOpen ? (
                    <ChevronDown className="h-4 w-4 text-amber-600 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                  <Map className="h-4 w-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {st.name} ({st.code})
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        State
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {st.districts.length} Districts
                    </span>
                  </div>
                </button>

                {onAddDistrict && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                    onClick={() => onAddDistrict(st.id)}
                  >
                    Add District
                  </Button>
                )}
              </div>

              {/* Districts Container */}
              {isStateOpen && (
                <div className="p-3 space-y-3 pl-4 sm:pl-6 border-l-2 border-slate-200 dark:border-slate-700 ml-4 my-2">
                  {st.districts.map((dist) => {
                    const isDistrictOpen = expandedDistricts[dist.id] !== false;

                    return (
                      <div
                        key={dist.id}
                        className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                      >
                        {/* District Header */}
                        <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/40">
                          <button
                            type="button"
                            onClick={() => toggleDistrict(dist.id)}
                            className="flex items-center gap-2 text-left"
                          >
                            {isDistrictOpen ? (
                              <ChevronDown className="h-3.5 w-3.5 text-amber-600" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            <Layers className="h-3.5 w-3.5 text-slate-500" />
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                              {dist.name} ({dist.code})
                            </span>
                            <span className="text-[10px] text-slate-400">
                              • {dist.cities.length} Cities
                            </span>
                          </button>

                          {onAddCity && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-[11px] px-2"
                              leftIcon={<Plus className="h-3 w-3" />}
                              onClick={() => onAddCity(st.id, dist.id)}
                            >
                              Add City
                            </Button>
                          )}
                        </div>

                        {/* Cities Container */}
                        {isDistrictOpen && (
                          <div className="p-2 space-y-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-4 my-1">
                            {dist.cities.map((city) => {
                              const isCityOpen = expandedCities[city.id] !== false;

                              return (
                                <div
                                  key={city.id}
                                  className="rounded-lg border border-slate-100 dark:border-slate-800/60 p-2.5 bg-slate-50/30 dark:bg-slate-900/40 space-y-2"
                                >
                                  {/* City Bar */}
                                  <div className="flex items-center justify-between">
                                    <button
                                      type="button"
                                      onClick={() => toggleCity(city.id)}
                                      className="flex items-center gap-2 text-left"
                                    >
                                      {isCityOpen ? (
                                        <ChevronDown className="h-3 w-3 text-amber-600" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3 text-slate-400" />
                                      )}
                                      <MapPin className="h-3.5 w-3.5 text-amber-500" />
                                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                                        {city.name}
                                      </span>
                                      <Badge variant="secondary" className="text-[10px] py-0">
                                        {city.branches.length} Branches
                                      </Badge>
                                    </button>

                                    {onAddBranch && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-[11px] px-2 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                                        leftIcon={<Plus className="h-3 w-3" />}
                                        onClick={() => onAddBranch(city.id)}
                                      >
                                        + Branch
                                      </Button>
                                    )}
                                  </div>

                                  {/* Branches Grid */}
                                  {isCityOpen && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1 pl-4">
                                      {city.branches.map((br) => (
                                        <div
                                          key={br.id}
                                          onClick={() => onSelectBranch?.(br)}
                                          className="flex flex-col justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/60 hover:shadow-xs transition-all cursor-pointer group"
                                        >
                                          <div>
                                            <div className="flex items-center justify-between gap-1 mb-1">
                                              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors truncate">
                                                {br.name}
                                              </span>
                                              {br.isMain && (
                                                <Badge
                                                  variant="default"
                                                  className="text-[9px] px-1 py-0"
                                                >
                                                  HQ
                                                </Badge>
                                              )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                              {br.address}
                                            </p>
                                          </div>

                                          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                            <span>Code: {br.code}</span>
                                            <Badge variant="success" showDot className="text-[10px]">
                                              {br.status}
                                            </Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
