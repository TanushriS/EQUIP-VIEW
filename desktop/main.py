import sys
import requests
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QPushButton, QLabel, QFileDialog, 
                             QTabWidget, QTableWidget, QTableWidgetItem, QMessageBox)
from PyQt5.QtCore import Qt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

API_URL = "http://localhost:8000/api/datasets/"

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("EquipView Desktop")
        self.setGeometry(100, 100, 1000, 800)
        
        self.layout = QVBoxLayout()
        self.central_widget = QWidget()
        self.central_widget.setLayout(self.layout)
        self.setCentralWidget(self.central_widget)
        
        self.tabs = QTabWidget()
        self.layout.addWidget(self.tabs)
        
        self.create_upload_tab()
        self.create_dashboard_tab()
        self.create_history_tab()

    def create_upload_tab(self):
        self.upload_tab = QWidget()
        layout = QVBoxLayout()
        
        self.file_label = QLabel("No file selected")
        self.file_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.file_label)
        
        select_btn = QPushButton("Select CSV File")
        select_btn.clicked.connect(self.select_file)
        layout.addWidget(select_btn)
        
        upload_btn = QPushButton("Upload to Server")
        upload_btn.clicked.connect(self.upload_file)
        layout.addWidget(upload_btn)
        
        layout.addStretch()
        self.upload_tab.setLayout(layout)
        self.tabs.addTab(self.upload_tab, "Upload")
        
        self.selected_file_path = None

    def create_dashboard_tab(self):
        self.dashboard_tab = QWidget()
        layout = QVBoxLayout()
        
        # Stats Row
        stats_layout = QHBoxLayout()
        self.lbl_total = QLabel("Total Equipment: -")
        self.lbl_flow = QLabel("Avg Flowrate: -")
        self.lbl_pressure = QLabel("Avg Pressure: -")
        self.lbl_temp = QLabel("Avg Temp: -")
        
        for lbl in [self.lbl_total, self.lbl_flow, self.lbl_pressure, self.lbl_temp]:
            lbl.setStyleSheet("font-size: 14px; font-weight: bold; border: 1px solid #ccc; padding: 10px; border-radius: 5px;")
            stats_layout.addWidget(lbl)
            
        layout.addLayout(stats_layout)
        
        # Charts
        self.figure = Figure(figsize=(5, 4), dpi=100)
        self.canvas = FigureCanvas(self.figure)
        layout.addWidget(self.canvas)
        
        refresh_btn = QPushButton("Refresh Data")
        refresh_btn.clicked.connect(self.update_dashboard)
        layout.addWidget(refresh_btn)
        
        self.dashboard_tab.setLayout(layout)
        self.tabs.addTab(self.dashboard_tab, "Dashboard")

    def create_history_tab(self):
        self.history_tab = QWidget()
        layout = QVBoxLayout()
        
        self.history_table = QTableWidget()
        self.history_table.setColumnCount(3)
        self.history_table.setHorizontalHeaderLabels(["ID", "Filename", "Uploaded At"])
        layout.addWidget(self.history_table)
        
        refresh_btn = QPushButton("Refresh History")
        refresh_btn.clicked.connect(self.update_history)
        layout.addWidget(refresh_btn)
        
        self.history_tab.setLayout(layout)
        self.tabs.addTab(self.history_tab, "History")

    def select_file(self):
        options = QFileDialog.Options()
        file_path, _ = QFileDialog.getOpenFileName(self, "Select CSV", "", "CSV Files (*.csv);;All Files (*)", options=options)
        if file_path:
            self.selected_file_path = file_path
            self.file_label.setText(f"Selected: {file_path}")

    def upload_file(self):
        if not self.selected_file_path:
            QMessageBox.warning(self, "Error", "Please select a file first.")
            return

        try:
            with open(self.selected_file_path, 'rb') as f:
                files = {'file': f}
                response = requests.post(API_URL, files=files)
            
            if response.status_code == 201:
                QMessageBox.information(self, "Success", "File uploaded successfully!")
                self.selected_file_path = None
                self.file_label.setText("No file selected")
                self.update_dashboard(response.json())
                self.tabs.setCurrentIndex(1) # Switch to dashboard
            else:
                QMessageBox.critical(self, "Error", f"Upload failed: {response.text}")
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Connection error: {str(e)}")

    def update_dashboard(self, data=None):
        if not data:
            # Fetch latest
            try:
                response = requests.get(f"{API_URL}latest/")
                if response.status_code == 200:
                    data = response.json()
                else:
                    return # No data
            except:
                return

        if "stats" not in data:
             QMessageBox.information(self, "Info", "No data available.")
             return

        stats = data['stats']
        self.lbl_total.setText(f"Total Equipment: {stats.get('totalEquipment', 0)}")
        self.lbl_flow.setText(f"Avg Flowrate: {stats.get('avgFlowrate', 0):.2f}")
        self.lbl_pressure.setText(f"Avg Pressure: {stats.get('avgPressure', 0):.2f}")
        self.lbl_temp.setText(f"Avg Temp: {stats.get('avgTemperature', 0):.2f}")
        
        # Update Charts
        self.figure.clear()
        
        # Type Distribution Pie Chart
        ax1 = self.figure.add_subplot(121)
        type_dist = stats.get('typeDistribution', {})
        if type_dist:
            ax1.pie(type_dist.values(), labels=type_dist.keys(), autopct='%1.1f%%')
            ax1.set_title("Equipment Types")
        
        # Parameter Bar Chart (Top 5 Flowrates for simplicity in desktop view)
        ax2 = self.figure.add_subplot(122)
        raw_data = data.get('data', [])
        if raw_data:
            # Sort by flowrate and take top 5
            sorted_data = sorted(raw_data, key=lambda x: x.get('flowrate', 0), reverse=True)[:5]
            names = [x.get('equipmentName', '')[:10] for x in sorted_data]
            flows = [x.get('flowrate', 0) for x in sorted_data]
            ax2.bar(names, flows)
            ax2.set_title("Top 5 Flowrates")
            ax2.tick_params(axis='x', rotation=45)
        
        self.canvas.draw()

    def update_history(self):
        try:
            response = requests.get(API_URL)
            if response.status_code == 200:
                datasets = response.json() # Should be a list based on ModelViewSet list
                # DRF optional pagination: if paginated, data is in 'results'
                if isinstance(datasets, dict) and 'results' in datasets:
                    datasets = datasets['results']
                
                self.history_table.setRowCount(len(datasets))
                for i, ds in enumerate(datasets):
                    self.history_table.setItem(i, 0, QTableWidgetItem(str(ds['id'])))
                    self.history_table.setItem(i, 1, QTableWidgetItem(ds['filename']))
                    self.history_table.setItem(i, 2, QTableWidgetItem(ds['uploaded_at']))
        except Exception as e:
            print(f"Error fetching history: {e}")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
