from ultralytics import YOLO

model = YOLO("yolov8n.pt")

WASTE_CLASSES = [
    "bottle", "cup", "plastic", "plastic bag",
    "can", "wrapper", "trash", "garbage"
]

def detect_waste(image_path):
    results = model(image_path)

    detected_waste = []

    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            label = model.names[cls_id]

            for waste in WASTE_CLASSES:
                if waste in label.lower():
                    detected_waste.append(label)

    return detected_waste


if __name__ == "__main__":
    print("Running waste detection...")
    results = model("water/waste_detection/test.jpg")

    all_objects = []
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            label = model.names[cls_id]
            all_objects.append(label)

    print("All detected objects:", all_objects)


