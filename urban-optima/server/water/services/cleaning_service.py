from water.services.waste_service import get_waste_report


def trigger_cleaning(before_report):
    """
    Simulates automated cleaning decision
    """
    if before_report["waste_detected"]:
        return {
            "cleaning_triggered": True,
            "method": "Automated cleaning unit dispatched"
        }

    return {
        "cleaning_triggered": False,
        "method": "No cleaning required"
    }


def verify_cleaning(before_image, after_image):
    """
    Verifies if cleaning was successful by comparing
    waste detection before and after
    """

    before = get_waste_report(before_image)
    after = get_waste_report(after_image)

    cleaning_successful = (
        before["waste_detected"] is True
        and after["waste_detected"] is False
    )

    return {
        "before": before,
        "after": after,
        "cleaning_successful": cleaning_successful
    }
