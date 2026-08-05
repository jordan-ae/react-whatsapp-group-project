import "./Modal.css";

export default function Modal({ title, children, onclose }) {
    
    return (
        <div className="modal">
            <div className="overlay">
                <div className="header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onclose}>
                        x
                    </button>
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
}