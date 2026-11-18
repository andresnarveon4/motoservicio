function List() {
  const orders = [
    {
      categoria: "Farmacia",
      direccion: "Av. Benavides 245",
      nombre: "Valeria",
      precio: 28.75,
      estado: "Pendiente",
    },
    {
      categoria: "Restaurante",
      direccion: "Jr. Huancavelica 118",
      nombre: "Sebastian",
      precio: 42.9,
      estado: "En camino",
    },
    {
      categoria: "Tecnologia",
      direccion: "Calle Lima 802",
      nombre: "Camila",
      precio: 156.49,
      estado: "Entregado",
    },
    {
      categoria: "Abarrotes",
      direccion: "Psje. El Sol 73",
      nombre: "Lucia",
      precio: 35.29,
      estado: "Pendiente",
    },
    {
      categoria: "Mascotas",
      direccion: "Av. Primavera 530",
      nombre: "Andres",
      precio: 67.8,
      estado: "En camino",
    },
    {
      categoria: "Panaderia",
      direccion: "Jr. Los Pinos 214",
      nombre: "Elena",
      precio: 14.5,
      estado: "Entregado",
    },
  ];
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-on-surface">
          Pedidos Registrados
        </h2>
        <span className="text-xs text-secondary font-medium" id="orderCount">
          {orders.length} pendientes
        </span>
      </div>
      <div className="flex flex-col gap-2.5" id="orderList">
        {orders.map((item) => (
          <article
            className="bg-surface-container-lowest rounded-xl p-4 border border-border-subtle shadow-sm flex flex-col gap-2"
            key={item.nombre}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-on-surface">
                {item.nombre}
              </span>
              <span className="text-sm font-bold text-primary">
                ${item.precio.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary">
              <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface font-medium">
                {item.categoria}
              </span>
              <span className="truncate">{item.direccion} #420</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default List;
