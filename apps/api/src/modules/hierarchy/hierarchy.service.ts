import { Injectable, NotFoundException } from '@nestjs/common';
import type { State, District, City, Branch } from '@hive/types';

@Injectable()
export class HierarchyService {
  private states: State[] = [
    {
      id: 'st_telangana',
      organizationId: 'org_hive_luxury',
      name: 'Telangana',
      code: 'TS',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'st_karnataka',
      organizationId: 'org_hive_luxury',
      name: 'Karnataka',
      code: 'KA',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'st_maharashtra',
      organizationId: 'org_hive_luxury',
      name: 'Maharashtra',
      code: 'MH',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private districts: District[] = [
    {
      id: 'dist_hyderabad',
      organizationId: 'org_hive_luxury',
      stateId: 'st_telangana',
      name: 'Hyderabad District',
      code: 'HYD-D',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dist_bengaluru_urban',
      organizationId: 'org_hive_luxury',
      stateId: 'st_karnataka',
      name: 'Bengaluru Urban',
      code: 'BLR-U',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dist_mumbai_suburban',
      organizationId: 'org_hive_luxury',
      stateId: 'st_maharashtra',
      name: 'Mumbai Suburban',
      code: 'MUM-S',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private cities: City[] = [
    {
      id: 'city_hyderabad',
      organizationId: 'org_hive_luxury',
      stateId: 'st_telangana',
      districtId: 'dist_hyderabad',
      name: 'Hyderabad',
      code: 'HYD',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'city_bengaluru',
      organizationId: 'org_hive_luxury',
      stateId: 'st_karnataka',
      districtId: 'dist_bengaluru_urban',
      name: 'Bengaluru',
      code: 'BLR',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'city_mumbai',
      organizationId: 'org_hive_luxury',
      stateId: 'st_maharashtra',
      districtId: 'dist_mumbai_suburban',
      name: 'Mumbai',
      code: 'MUM',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private branches: Branch[] = [
    {
      id: 'b_jh_01',
      organizationId: 'org_hive_luxury',
      stateId: 'st_telangana',
      districtId: 'dist_hyderabad',
      cityId: 'city_hyderabad',
      name: 'Jubilee Hills Flagship',
      code: 'JH-01',
      address: 'Road No. 36, Jubilee Hills, Hyderabad',
      phone: '+91 40 2355 7890',
      email: 'jubilee@hivesalon.in',
      managerUserId: 'usr_mgr_hyd',
      openingDate: '2024-01-15',
      status: 'ACTIVE',
      isActive: true,
      isMainBranch: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'b_bh_02',
      organizationId: 'org_hive_luxury',
      stateId: 'st_telangana',
      districtId: 'dist_hyderabad',
      cityId: 'city_hyderabad',
      name: 'Banjara Hills Spa & Lounge',
      code: 'BH-02',
      address: 'Road No. 12, Banjara Hills, Hyderabad',
      phone: '+91 40 2334 5678',
      email: 'banjara@hivesalon.in',
      openingDate: '2024-06-10',
      status: 'ACTIVE',
      isActive: true,
      isMainBranch: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'b_hc_03',
      organizationId: 'org_hive_luxury',
      stateId: 'st_telangana',
      districtId: 'dist_hyderabad',
      cityId: 'city_hyderabad',
      name: 'Hitech City Express',
      code: 'HC-03',
      address: 'Cyber Towers Quad, Hitech City, Hyderabad',
      phone: '+91 40 6789 0123',
      email: 'hitech@hivesalon.in',
      openingDate: '2025-02-01',
      status: 'ACTIVE',
      isActive: true,
      isMainBranch: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'b_in_01',
      organizationId: 'org_hive_luxury',
      stateId: 'st_karnataka',
      districtId: 'dist_bengaluru_urban',
      cityId: 'city_bengaluru',
      name: 'Indiranagar Sanctuary',
      code: 'IN-01',
      address: '100ft Road, Indiranagar, Bengaluru',
      phone: '+91 80 4123 4567',
      email: 'indiranagar@hivesalon.in',
      openingDate: '2025-08-20',
      status: 'ACTIVE',
      isActive: true,
      isMainBranch: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  getHierarchyTree(organizationId: string) {
    return this.states.map((st) => ({
      ...st,
      districts: this.districts
        .filter((d) => d.stateId === st.id)
        .map((dist) => ({
          ...dist,
          cities: this.cities
            .filter((c) => c.districtId === dist.id)
            .map((city) => ({
              ...city,
              branches: this.branches.filter((b) => b.cityId === city.id),
            })),
        })),
    }));
  }

  getStates(organizationId: string) {
    return this.states.filter((s) => s.organizationId === organizationId);
  }

  createState(organizationId: string, data: Partial<State>): State {
    const newState: State = {
      id: `st_${Date.now()}`,
      organizationId,
      name: data.name || '',
      code: data.code?.toUpperCase() || '',
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.states.push(newState);
    return newState;
  }

  getDistricts(stateId?: string) {
    return stateId ? this.districts.filter((d) => d.stateId === stateId) : this.districts;
  }

  getCities(districtId?: string) {
    return districtId ? this.cities.filter((c) => c.districtId === districtId) : this.cities;
  }

  getBranches(organizationId: string) {
    return this.branches.filter((b) => b.organizationId === organizationId);
  }

  getBranchById(branchId: string): Branch {
    const branch = this.branches.find((b) => b.id === branchId);
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${branchId} was not found.`);
    }
    return branch;
  }

  createBranch(organizationId: string, data: Partial<Branch>): Branch {
    const newBranch: Branch = {
      id: `b_${Date.now()}`,
      organizationId,
      stateId: data.stateId || null,
      districtId: data.districtId || null,
      cityId: data.cityId || null,
      name: data.name || '',
      code: data.code?.toUpperCase() || '',
      address: data.address || '',
      phone: data.phone || '',
      email: data.email || null,
      managerUserId: data.managerUserId || null,
      openingDate: data.openingDate || new Date().toISOString(),
      status: data.status || 'ACTIVE',
      isActive: true,
      isMainBranch: data.isMainBranch || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.branches.push(newBranch);
    return newBranch;
  }
}
