export default function BrandShowcase() {
  return (
    <aside className="showcase">
      <img src="/nest-showcase.jpg" alt="A modern FindNest property" />
      <div className="showcase-content">
        <h2>Find a place that feels like home.</h2>
        <p>
          FindNest helps you buy, sell, and rent verified properties from one
          simple account.
        </p>
        <div className="feature-list">
          <div className="feature">
            <strong>Buy</strong>
            <span>Find your nest</span>
          </div>
          <div className="feature">
            <strong>Sell</strong>
            <span>Reach buyers</span>
          </div>
          <div className="feature">
            <strong>Rent</strong>
            <span>Live better</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
