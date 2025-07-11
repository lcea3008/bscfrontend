interface KPIData {
    id: string
    title: string
    value: string
    target: string
    percentage: number
    status: "success" | "warning" | "danger"
    trend: "up" | "down" | "stable"
    perspective: string
}

export const kpidata = {
    //obtener kpi 
    async getKpis(): Promise<KPIData[]> {
        try {
            const response = await fetch("/api/kpis", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("Error al obtener KPIs");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching KPIs:", error);
            throw error;
        }
    },

    // Actualizar KPI
  async updateKPI(kpiId: string, data: Partial<KPIData>): Promise<KPIData> {
    try {
      const response = await fetch(`/api/kpis/${kpiId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar KPI")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating KPI:", error)
      throw error
    }
  },
}