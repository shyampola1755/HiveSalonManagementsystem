import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  ServiceItem,
  ServiceCategoryItem,
  ServiceBranchPrice,
  ServiceStaffEligibilityItem,
  ServiceAddonItem,
  ServiceWizardPayload,
} from '@hive/types';
import { STANDARD_SERVICE_CATEGORIES } from '@hive/config';

@Injectable()
export class ServiceService {
  // Categories in-memory store
  private categoriesDb: Map<string, ServiceCategoryItem> = new Map(
    STANDARD_SERVICE_CATEGORIES.map((cat, idx) => [
      `cat-${idx + 1}`,
      {
        id: `cat-${idx + 1}`,
        organizationId: 'org_hive_demo',
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        sortOrder: idx + 1,
        isActive: true,
        serviceCount: cat.name === 'Hair' ? 4 : cat.name === 'Hair Color' ? 3 : cat.name === 'Facial' ? 2 : 1,
        isCustom: false,
      },
    ])
  );

  // Initial Seed Services with Branch Pricing Overrides & Add-ons
  private servicesDb: Map<string, ServiceItem> = new Map([
    [
      'srv-1',
      {
        id: 'srv-1',
        organizationId: 'org_hive_demo',
        categoryId: 'cat-1',
        categoryName: 'Hair',
        name: 'Signature Precision Haircut & Styling',
        customerDescription:
          'Consultation, custom tailored precision haircut, luxury wash with botanical scalp massage, and bespoke blowdry finish.',
        internalNotes:
          'Allow 5m for face shape consultation. Check previous clipper guard numbers in formula notes before starting.',
        durationMinutes: 45,
        bufferMinutes: 10,
        totalSlotMinutes: 55,
        basePrice: 650.0,
        taxRate: 18.0,
        status: 'ACTIVE',
        genderTarget: 'ALL',
        onlineBookingEnabled: true,
        branchPricings: [
          { branchId: 'b1', branchName: 'Jubilee Hills Flagship', branchCode: 'JH-01', price: 750.0, isAvailable: true },
          { branchId: 'b2', branchName: 'Banjara Hills Spa', branchCode: 'BH-02', price: 650.0, isAvailable: true },
          { branchId: 'b3', branchName: 'Hitech City Express', branchCode: 'HC-03', price: 500.0, isAvailable: true },
        ],
        staffEligibilities: [
          { staffId: 's1', staffName: 'Ananya Reddy', employeeCode: 'STF-001', jobTitle: 'Senior Art Director', isEligible: true },
          { staffId: 's3', staffName: 'Rahul Varma', employeeCode: 'STF-003', jobTitle: 'Master Stylist', isEligible: true },
        ],
        addons: [
          { id: 'add-1', serviceId: 'srv-1', name: 'Aromatherapy Scalp Massage (15m)', description: 'Calming lavender scalp pressure therapy', durationMinutes: 15, price: 450.0, isActive: true },
          { id: 'add-2', serviceId: 'srv-1', name: 'Olaplex No. 2 Bond Multiplier Wash', description: 'Intensive bond repair shampoo basin treatment', durationMinutes: 10, price: 600.0, isActive: true },
          { id: 'add-3', serviceId: 'srv-1', name: 'Moroccan Oil Gloss Finish', description: 'Argan oil smoothing serum & shine mist', durationMinutes: 5, price: 250.0, isActive: true },
        ],
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-09-08T10:00:00Z',
      },
    ],
    [
      'srv-2',
      {
        id: 'srv-2',
        organizationId: 'org_hive_demo',
        categoryId: 'cat-2',
        categoryName: 'Hair Color',
        name: 'Sun-Kissed Balayage & Glossing Ritual',
        customerDescription:
          'Freehand hand-painted dimensional highlights, bond-protecting lightener, and tonal gloss finish for seamless grow-out.',
        internalNotes:
          'Mandatory PPD patch test required 48h prior for first-time clients. Use foil boards for saturation.',
        durationMinutes: 120,
        bufferMinutes: 15,
        totalSlotMinutes: 135,
        basePrice: 4500.0,
        taxRate: 18.0,
        status: 'ACTIVE',
        genderTarget: 'FEMALE',
        onlineBookingEnabled: true,
        branchPricings: [
          { branchId: 'b1', branchName: 'Jubilee Hills Flagship', branchCode: 'JH-01', price: 5200.0, isAvailable: true },
          { branchId: 'b2', branchName: 'Banjara Hills Spa', branchCode: 'BH-02', price: 4500.0, isAvailable: true },
          { branchId: 'b3', branchName: 'Hitech City Express', branchCode: 'HC-03', price: 4000.0, isAvailable: true },
        ],
        staffEligibilities: [
          { staffId: 's1', staffName: 'Ananya Reddy', employeeCode: 'STF-001', jobTitle: 'Senior Art Director', isEligible: true },
        ],
        addons: [
          { id: 'add-4', serviceId: 'srv-2', name: 'Metal Detox Anti-Deposit Cleansing', description: 'Neutralizes copper deposits inside hair fiber', durationMinutes: 10, price: 850.0, isActive: true },
          { id: 'add-5', serviceId: 'srv-2', name: 'Olaplex Full Bond Building Step 1 & 2', description: 'Cross-links disulfide bonds during lightening', durationMinutes: 20, price: 1200.0, isActive: true },
        ],
        createdAt: '2026-01-15T11:00:00Z',
        updatedAt: '2026-09-08T10:00:00Z',
      },
    ],
    [
      'srv-3',
      {
        id: 'srv-3',
        organizationId: 'org_hive_demo',
        categoryId: 'cat-4',
        categoryName: 'Facial',
        name: 'Hydra-Infusion Oxygen Facial',
        customerDescription:
          'Multi-step hydro-dermabrasion, vacuum pore extraction, antioxidant infusion, and cryo-firming LED therapy.',
        internalNotes:
          'Check for retinol/AHA usage in past 72 hours. Sanitize handpiece tips in autoclave.',
        durationMinutes: 60,
        bufferMinutes: 15,
        totalSlotMinutes: 75,
        basePrice: 3500.0,
        taxRate: 18.0,
        status: 'ACTIVE',
        genderTarget: 'ALL',
        onlineBookingEnabled: true,
        branchPricings: [
          { branchId: 'b1', branchName: 'Jubilee Hills Flagship', branchCode: 'JH-01', price: 3800.0, isAvailable: true },
          { branchId: 'b2', branchName: 'Banjara Hills Spa', branchCode: 'BH-02', price: 3500.0, isAvailable: true },
        ],
        staffEligibilities: [
          { staffId: 's2', staffName: 'Kavita Nair', employeeCode: 'STF-002', jobTitle: 'Aesthetic Specialist', isEligible: true },
        ],
        addons: [
          { id: 'add-6', serviceId: 'srv-3', name: '24K Gold Collagen Eye Contour Patch', description: 'De-puffs and brightens dark circles', durationMinutes: 15, price: 650.0, isActive: true },
        ],
        createdAt: '2026-02-01T12:00:00Z',
        updatedAt: '2026-09-08T10:00:00Z',
      },
    ],
  ]);

  /**
   * List all service categories
   */
  async getCategories(organizationId: string = 'org_hive_demo'): Promise<ServiceCategoryItem[]> {
    return Array.from(this.categoriesDb.values()).filter(
      (c) => c.organizationId === organizationId
    );
  }

  /**
   * Create custom category
   */
  async createCategory(organizationId: string, payload: any): Promise<ServiceCategoryItem> {
    const id = `cat_${Date.now()}`;
    const newCat: ServiceCategoryItem = {
      id,
      organizationId,
      name: payload.name,
      slug: payload.name.toLowerCase().replace(/\s+/g, '-'),
      description: payload.description || null,
      icon: payload.icon || 'Sparkles',
      color: payload.color || '#f59e0b',
      sortOrder: this.categoriesDb.size + 1,
      isActive: true,
      serviceCount: 0,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    this.categoriesDb.set(id, newCat);
    return newCat;
  }

  /**
   * List services with optional branch effective price resolution
   */
  async getServices(
    branchId?: string,
    categoryId?: string,
    search?: string,
    organizationId: string = 'org_hive_demo'
  ): Promise<ServiceItem[]> {
    const list = Array.from(this.servicesDb.values()).filter(
      (s) => s.organizationId === organizationId
    );

    const cleanSearch = (search || '').trim().toLowerCase();

    return list
      .filter((s) => {
        if (categoryId && categoryId !== 'all' && s.categoryId !== categoryId) {
          return false;
        }
        if (cleanSearch && !s.name.toLowerCase().includes(cleanSearch) && !s.customerDescription?.toLowerCase().includes(cleanSearch)) {
          return false;
        }
        return true;
      })
      .map((s) => {
        // Resolve effective price for the branch context
        let effectivePrice = Number(s.basePrice);
        if (branchId) {
          const override = s.branchPricings.find((bp) => bp.branchId === branchId);
          if (override && override.isAvailable) {
            effectivePrice = Number(override.price);
          }
        }
        return {
          ...s,
          effectivePrice,
          totalSlotMinutes: s.durationMinutes + s.bufferMinutes,
        };
      });
  }

  /**
   * Get full service details by ID
   */
  async getServiceById(id: string, branchId?: string, organizationId: string = 'org_hive_demo'): Promise<ServiceItem> {
    const service = this.servicesDb.get(id);
    if (!service || service.organizationId !== organizationId) {
      throw new NotFoundException(`Service with ID "${id}" not found.`);
    }

    let effectivePrice = Number(service.basePrice);
    if (branchId) {
      const override = service.branchPricings.find((bp) => bp.branchId === branchId);
      if (override && override.isAvailable) {
        effectivePrice = Number(override.price);
      }
    }

    return {
      ...service,
      effectivePrice,
      totalSlotMinutes: service.durationMinutes + service.bufferMinutes,
    };
  }

  /**
   * Create new service via 6-step Wizard Payload
   */
  async createService(organizationId: string, payload: ServiceWizardPayload): Promise<ServiceItem> {
    const id = `srv_${Date.now()}`;
    const category = this.categoriesDb.get(payload.categoryId);

    const newService: ServiceItem = {
      id,
      organizationId,
      categoryId: payload.categoryId,
      categoryName: category?.name || 'Hair',
      name: payload.name,
      customerDescription: payload.customerDescription || null,
      internalNotes: payload.internalNotes || null,
      durationMinutes: Number(payload.durationMinutes) || 30,
      bufferMinutes: Number(payload.bufferMinutes) || 10,
      totalSlotMinutes: (Number(payload.durationMinutes) || 30) + (Number(payload.bufferMinutes) || 10),
      basePrice: Number(payload.basePrice),
      taxRate: Number(payload.taxRate) || 18.0,
      imageUrl: payload.imageUrl || null,
      status: payload.status || 'ACTIVE',
      genderTarget: payload.genderTarget || 'ALL',
      onlineBookingEnabled: payload.onlineBookingEnabled !== false,
      branchPricings: payload.branchPricings?.length
        ? payload.branchPricings.map((bp) => ({
            ...bp,
            serviceId: id,
            price: Number(bp.price),
          }))
        : [
            { branchId: 'b1', branchName: 'Jubilee Hills Flagship', branchCode: 'JH-01', price: Number(payload.basePrice), isAvailable: true },
            { branchId: 'b2', branchName: 'Banjara Hills Spa', branchCode: 'BH-02', price: Number(payload.basePrice), isAvailable: true },
            { branchId: 'b3', branchName: 'Hitech City Express', branchCode: 'HC-03', price: Number(payload.basePrice), isAvailable: true },
          ],
      staffEligibilities: payload.staffIds?.length
        ? payload.staffIds.map((sid) => ({
            serviceId: id,
            staffId: sid,
            staffName: sid === 's1' ? 'Ananya Reddy' : sid === 's2' ? 'Kavita Nair' : 'Rahul Varma',
            isEligible: true,
          }))
        : [
            { serviceId: id, staffId: 's1', staffName: 'Ananya Reddy', isEligible: true },
          ],
      addons: payload.addons?.length
        ? payload.addons.map((add, idx) => ({
            id: `add_${id}_${idx}`,
            serviceId: id,
            name: add.name,
            description: add.description || null,
            durationMinutes: Number(add.durationMinutes) || 15,
            price: Number(add.price),
            isActive: true,
          }))
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.servicesDb.set(id, newService);

    // Update category count
    if (category) {
      category.serviceCount = (category.serviceCount || 0) + 1;
      this.categoriesDb.set(category.id, category);
    }

    return newService;
  }

  /**
   * Update service details
   */
  async updateService(id: string, organizationId: string, payload: Partial<ServiceItem>): Promise<ServiceItem> {
    const service = await this.getServiceById(id, undefined, organizationId);
    const updated: ServiceItem = {
      ...service,
      ...payload,
      totalSlotMinutes: (payload.durationMinutes || service.durationMinutes) + (payload.bufferMinutes || service.bufferMinutes),
      updatedAt: new Date().toISOString(),
    };
    this.servicesDb.set(id, updated);
    return updated;
  }

  /**
   * Add an Add-on to a service
   */
  async addAddon(serviceId: string, payload: Partial<ServiceAddonItem>): Promise<ServiceAddonItem> {
    const service = await this.getServiceById(serviceId);
    const addon: ServiceAddonItem = {
      id: `add_${Date.now()}`,
      serviceId,
      name: payload.name || 'Add-on Option',
      description: payload.description || null,
      durationMinutes: Number(payload.durationMinutes) || 15,
      price: Number(payload.price) || 250.0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    service.addons.push(addon);
    this.servicesDb.set(serviceId, service);
    return addon;
  }

  /**
   * Delete service
   */
  async deleteService(id: string, organizationId: string = 'org_hive_demo'): Promise<{ success: boolean; message: string }> {
    const service = await this.getServiceById(id, undefined, organizationId);
    this.servicesDb.delete(id);
    const category = this.categoriesDb.get(service.categoryId);
    if (category && category.serviceCount && category.serviceCount > 0) {
      category.serviceCount--;
      this.categoriesDb.set(category.id, category);
    }
    return { success: true, message: `Service "${service.name}" removed from catalog.` };
  }

  /**
   * Delete add-on
   */
  async deleteAddon(serviceId: string, addonId: string): Promise<{ success: boolean; message: string }> {
    const service = await this.getServiceById(serviceId);
    service.addons = service.addons.filter((a) => a.id !== addonId);
    this.servicesDb.set(serviceId, service);
    return { success: true, message: `Addon removed from service.` };
  }

  /**
   * Get branch & staff metadata for wizard configuration
   */
  async getBranchesAndStaff(organizationId: string = 'org_hive_demo') {
    return {
      branches: [
        { id: 'b1', name: 'Jubilee Hills Flagship', code: 'JH-01', tier: 'Tier 1' },
        { id: 'b2', name: 'Banjara Hills Spa', code: 'BH-02', tier: 'Tier 1' },
        { id: 'b3', name: 'Hitech City Express', code: 'HC-03', tier: 'Tier 2' },
      ],
      staff: [
        { id: 's1', name: 'Ananya Reddy', role: 'Senior Stylist' },
        { id: 's2', name: 'Kavita Nair', role: 'Lead Therapist' },
        { id: 's3', name: 'Rahul Varma', role: 'Master Barber' },
      ],
    };
  }
}
