export function Perforation() {
  const dashes = Array.from({ length: 46 });
  return (
    <div style={{ position: "relative", height: 1 }}>
      <div
        style={{
          position: "absolute",
          left: -8,
          right: -8,
          top: 0,
          borderTop: "1.5px dashed #cfc7ae",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -8,
          top: -6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#e9e4d6",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -8,
          top: -6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#e9e4d6",
        }}
      />
    </div>
  );
}
